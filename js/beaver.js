/**
 * Copyright reelyActive 2016-2023
 * We believe in an open Internet of Things
 */


let beaver = (function() {

  // Internal constants
  const SIGNATURE_SEPARATOR = '/';
  const DEFAULT_STREAM_PATH = '/devices';
  const DEFAULT_QUERY_PATH = '/context';
  const DEFAULT_DISAPPEARANCE_MILLISECONDS = 15000;

  // Internal variables
  let devices = new Map();
  let eventCallbacks = { connect: [], raddec: [], dynamb: [], spatem: [] };
  let disappearanceMilliseconds = DEFAULT_DISAPPEARANCE_MILLISECONDS;
  let purgeTimeout = null;

  // Handle the given raddec
  function handleRaddec(raddec) {
    let signature = raddec.transmitterId + SIGNATURE_SEPARATOR +
                    raddec.transmitterIdType;

    if(devices.has(signature)) {
      let device = devices.get(signature);
      if(!device.hasOwnProperty('raddec') ||
         (raddec.timestamp > device.raddec.timestamp)) {
        device.raddec = raddec;
      }
    }
    else {
      devices.set(signature, { raddec: raddec }); // TODO: nearest
    }

    eventCallbacks['raddec'].forEach(callback => callback(raddec));
  }

  // Handle the given dynamb
  function handleDynamb(dynamb) {
    let signature = dynamb.deviceId + SIGNATURE_SEPARATOR +
                    dynamb.deviceIdType;

    if(devices.has(signature)) {
      let device = devices.get(signature);
      if(!device.hasOwnProperty('dynamb') ||
         (dynamb.timestamp > device.dynamb.timestamp)) {
        device.dynamb = dynamb; // TODO: remove deviceId/Type
      }
    }
    else {
      devices.set(signature, { dynamb: dynamb });
    }

    eventCallbacks['dynamb'].forEach(callback => callback(dynamb));
  }

  // Handle the given spatem
  function handleSpatem(spatem) {
    let signature = spatem.deviceId + SIGNATURE_SEPARATOR +
                    spatem.deviceIdType;

    eventCallbacks['spatem'].forEach(callback => callback(spatem));

    // TODO
  }

  // Handle a context query callback
  function handleContext(data, err) {
    if(err) {
      return console.log('beaver.js context query failed:\r\n', err);
    }
    for(const signature in data.devices) {
      devices.set(signature, data.devices[signature]); // TODO: merge?
    }
  }

  // Purge any stale transmitters as disappearances
  function purgeDisappearances() {
    let currentTime = new Date().getTime();
    let nextPurgeTime = currentTime + disappearanceMilliseconds;

    // TODO

    let timeoutMilliseconds = Math.max(nextPurgeTime - currentTime, 10);
    purgeTimeout = setTimeout(purgeDisappearances, timeoutMilliseconds);
  }

  // Perform a HTTP GET on the given URL, accepting JSON
  function retrieveJson(url, callback) {
    fetch(url, { headers: { "Accept": "application/json" } })
      .then((response) => {
        if(!response.ok) {
          throw new Error('GET ' + url + ' returned status ' + response.status);
        }
        return response.json();
      })
      .then((result) => { return callback(result); })
      .catch((error) => { return callback(null, error); });
  }

  // Handle socket.io events
  function handleSocketEvents(socket) {
    socket.on('connect', () => {
      console.log('beaver.js connected to socket');
      eventCallbacks['connect'].forEach(callback => callback());
    });
    socket.on('raddec', handleRaddec);
    socket.on('dynamb', handleDynamb);
    socket.on('spatem', handleSpatem);
    socket.on('disconnect', (message) => {
      console.log('beaver.js disconnected from socket:', message);
    });
  }

  // Stream from the given server
  let stream = function(serverRootUrl, options) {
    options = options || {};
    options.isDebug = options.isDebug || false;

    let streamUrl = serverRootUrl + DEFAULT_STREAM_PATH;
    let queryUrl = serverRootUrl + DEFAULT_QUERY_PATH;
    let streams = {};

    if(options.deviceSignature) {
      streamUrl = serverRootUrl + '/context/device/' + options.deviceSignature;
      queryUrl = streamUrl;
    }

    retrieveJson(queryUrl, handleContext);
    if(options.io) {
      streams.socket = options.io.connect(streamUrl);
      handleSocketEvents(streams.socket);
    }

    return streams;
  };

  // Register a callback for the given event
  let setEventCallback = function(event, callback) {
    let isValidEvent = event && eventCallbacks.hasOwnProperty(event);
    let isValidCallback = callback && (typeof callback === 'function');

    if(isValidEvent && isValidCallback) {
      eventCallbacks[event].push(callback);
    }
  }

  // Expose the following functions and variables
  return {
    stream: stream,
    on: setEventCallback,
    devices: devices
  }

}());
