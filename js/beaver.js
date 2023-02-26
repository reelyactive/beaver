/**
 * Copyright reelyActive 2016-2023
 * We believe in an open Internet of Things
 */


let beaver = (function() {

  // Internal constants
  const SIGNATURE_SEPARATOR = '/';
  const DEFAULT_STREAM_PATH = '/devices';
  const DEFAULT_QUERY_PATH = '/context';
  const DEFAULT_UPDATE_MILLISECONDS = 5000;
  const DEFAULT_STALE_DEVICE_MILLISECONDS = 60000;

  // Internal variables
  let devices = new Map();
  let eventCallbacks = { connect: [], raddec: [], dynamb: [], spatem: [],
                         stats: [] };
  let eventCounts = { raddec: 0, dynamb: 0, spatem: 0 };
  let staleDeviceMilliseconds = DEFAULT_STALE_DEVICE_MILLISECONDS;
  let updateMilliseconds = DEFAULT_UPDATE_MILLISECONDS;
  let updateTimeout = null;
  let lastUpdateTime;

  // Create the array of nearest devices based on the given raddec & dynamb
  function createNearest(raddec, dynamb) {
    let nearest = [];
    if(raddec && Array.isArray(raddec.rssiSignature)) {
      raddec.rssiSignature.forEach((entry) => {
        let signature = entry.receiverId + SIGNATURE_SEPARATOR +
                        entry.receiverIdType;
        nearest.push({ device: signature, rssi: entry.rssi });
      });
    }
    if(dynamb && Array.isArray(dynamb.nearest)) {
      dynamb.nearest.forEach((entry) => { nearest.push(entry); });
    }
    return nearest.sort((a, b) => b.rssi - a.rssi);
  }

  // Create a copy of the given dynamb, trimmed of its identifier
  function createTrimmedDynamb(dynamb) {
    let trimmedDynamb = Object.assign({}, dynamb);
    delete trimmedDynamb.deviceId;
    delete trimmedDynamb.deviceIdType;
    return trimmedDynamb;
  }

  // Create a copy of the given spatem, trimmed of its identifier
  function createTrimmedSpatem(spatem) {
    let trimmedSpatem = Object.assign({}, spatem);
    delete trimmedSpatem.deviceId;
    delete trimmedSpatem.deviceIdType;
    return trimmedSpatem;
  }

  // Handle the given raddec
  function handleRaddec(raddec) {
    let signature = raddec.transmitterId + SIGNATURE_SEPARATOR +
                    raddec.transmitterIdType;
    let device = devices.get(signature);

    if(device) {
      if(!device.hasOwnProperty('raddec') ||
         (raddec.timestamp > device.raddec.timestamp)) {
        device.raddec = raddec;
        device.nearest = createNearest(device.raddec, device.dynamb);
      }
    }
    else {
      device = { raddec: raddec, nearest: createNearest(raddec) };
      devices.set(signature, device);
    }

    eventCallbacks['raddec'].forEach(callback => callback(raddec));
    eventCounts.raddec++;
  }

  // Handle the given dynamb
  function handleDynamb(dynamb) {
    let signature = dynamb.deviceId + SIGNATURE_SEPARATOR +
                    dynamb.deviceIdType;
    let device = devices.get(signature);

    if(device) {
      if(!device.hasOwnProperty('dynamb') ||
         (dynamb.timestamp > device.dynamb.timestamp)) {
        device.dynamb = createTrimmedDynamb(dynamb);
        device.nearest = createNearest(device.raddec, device.dynamb);
      }
    }
    else {
      device = { dynamb: createTrimmedDynamb(dynamb) };
      if(Array.isArray(dynamb.nearest)) {
        device.nearest = createNearest(device.raddec, device.dynamb);
      }
      devices.set(signature, device);
    }

    eventCallbacks['dynamb'].forEach(callback => callback(dynamb));
    eventCounts.dynamb++;
  }

  // Handle the given spatem
  function handleSpatem(spatem) {
    let signature = spatem.deviceId + SIGNATURE_SEPARATOR +
                    spatem.deviceIdType;
    let device = devices.get(signature);

    if(device) {
      if(!device.hasOwnProperty('spatem') ||
         (spatem.timestamp > device.spatem.timestamp)) {
        device.spatem = createTrimmedSpatem(spatem);
      }
    }
    else {
      device = { spatem: createTrimmedSpatem(spatem) };
      devices.set(signature, device);
    }

    eventCallbacks['spatem'].forEach(callback => callback(spatem));
    eventCounts.spatem++;
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

  // Remove stale data/devices from the graph
  function purgeStaleData() {
    let staleCollection = [];
    let nearestCollection = [];
    let staleTimestamp = Date.now() - staleDeviceMilliseconds;

    devices.forEach((device, signature) => {
      let isStale = !((device.raddec &&
                       (device.raddec.timestamp > staleTimestamp)) ||
                      (device.dynamb &&
                       (device.dynamb.timestamp > staleTimestamp)) ||
                      (device.spatem &&
                       (device.spatem.timestamp > staleTimestamp)));
      if(isStale) {
        staleCollection.push(signature);
      }
      else if(Array.isArray(device.nearest)) {
        device.nearest.forEach((entry) => {
          if(entry.device && !nearestCollection.includes(entry.device)) {
            nearestCollection.push(entry.device);
          }
        });
      }
    });

    staleCollection.forEach((signature) => {
      if(!nearestCollection.includes(signature)) {
        devices.delete(signature);
      }
    });
  }

  // Update the hyperlocal context graph and stats, then set next update
  function update() {
    let currentUpdateTime = Date.now();
    purgeStaleData();

    if(lastUpdateTime) {
      let updateIntervalSeconds = (currentUpdateTime - lastUpdateTime) / 1000;
      let stats = {
          numberOfDevices: devices.size,
          eventsPerSecond: {
              raddec: eventCounts.raddec / updateIntervalSeconds,
              dynamb: eventCounts.dynamb / updateIntervalSeconds,
              spatem: eventCounts.spatem / updateIntervalSeconds
          }
      };
      eventCounts.raddec = 0;
      eventCounts.dynamb = 0;
      eventCounts.spatem = 0;

      eventCallbacks['stats'].forEach(callback => callback(stats));
    }

    lastUpdateTime = currentUpdateTime;
    updateTimeout = setTimeout(update, updateMilliseconds);
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
      streamUrl = serverRootUrl + '/devices/' + options.deviceSignature;
      queryUrl = serverRootUrl + '/context/device/' + options.deviceSignature;
    }

    retrieveJson(queryUrl, handleContext);
    if(options.io) {
      streams.socket = options.io.connect(streamUrl);
      handleSocketEvents(streams.socket);
    }

    if(!updateTimeout) {
      update(); // Start periodic updates
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
