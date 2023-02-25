/**
 * Copyright reelyActive 2016-2023
 * We believe in an open Internet of Things
 */


let beaver = (function() {

  // Internal constants
  const SIGNATURE_SEPARATOR = '/';
  const DEFAULT_PATH = '/devices';
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

    eventCallbacks['raddec'].forEach(callback => callback(raddec));

    // TODO
  }

  // Handle the given dynamb
  function handleDynamb(dynamb) {
    let signature = dynamb.deviceId + SIGNATURE_SEPARATOR +
                    dynamb.deviceIdType;

    eventCallbacks['dynamb'].forEach(callback => callback(dynamb));

    // TODO
  }

  // Handle the given spatem
  function handleSpatem(spatem) {
    let signature = spatem.deviceId + SIGNATURE_SEPARATOR +
                    spatem.deviceIdType;

    eventCallbacks['spatem'].forEach(callback => callback(spatem));

    // TODO
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
      console.log('beaver connected to socket');
      eventCallbacks['connect'].forEach(callback => callback());
    });
    socket.on('raddec', handleRaddec);
    socket.on('dynamb', handleDynamb);
    socket.on('spatem', handleSpatem);
    socket.on('disconnect', (message) => {
      console.log('beaver disconnected from socket:', message);
    });
  }

  // Stream from the given server
  let stream = function(serverRootUrl, options) {
    options = options || {};
    options.isDebug = options.isDebug || false;
    options.path = options.path || DEFAULT_PATH;
    let serverUrl = serverRootUrl + options.path;

    // Query the API first
    retrieveJson(serverUrl, (data, err) => {
      if(err) {
        return console.log('beaver.js stream failed:', err);
      }
      for(const signature in data.devices) {
        devices.set(signature, data.devices[signature]);
      }

      if(options.io) { // Use socket.io
        let socket = options.io.connect(serverUrl);
        handleSocketEvents(socket);
      }
      else {               // Use polling

      }
    });
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
