/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */


angular.module('reelyactive.beaver', [])

  .factory('beaver', function beaverFactory() {

    var devices = {};
    var stats = { appearances: 0, displacements: 0, keepalives: 0,
                  disappearances: 0 };
    var eventCallbacks = {};


    // Use the given event to update the status of the corresponding device
    function updateDevice(type, event) {
      if(!isValidEvent) {
        return;
      }

      if(!event.hasOwnProperty('deviceId') && event.hasOwnProperty('tiraid')) {
        updateLegacyEvent(event);
      }

      var deviceId = event.deviceId;
      if(!devices.hasOwnProperty(deviceId)) {
        type = 'appearance';
      }

      if(type === 'appearance') { stats.appearances++; }
      if(type === 'displacement') { stats.displacements++; }
      if(type === 'keep-alive') { stats.keepalives++; }
      if(type === 'disappearance') {
        if(devices.hasOwnProperty(deviceId)) {
          delete devices[deviceId];
        }
        stats.disappearances++;
        handleEventCallback(type, event);
        return;
      }

      if(!devices.hasOwnProperty(deviceId)) {
        devices[deviceId] = { event:  event };
      }
      else {
        mergeDeviceEvents(devices[deviceId], event);
      }

      handleEventCallback(type, event);
    }


    // Verify if the given event is valid
    function isValidEvent(event) {
      if(!event) {
        return false;
      }
      if(!((event.deviceId && event.receiverId && event.rssi && event.time) ||
           (event.tiraid))) {
        return false;
      }
      return true;
    }


    // Update the given event to the current format
    function updateLegacyEvent(event) {
      event.deviceId = event.tiraid.identifier.value;
      event.time = new Date(event.tiraid.timestamp);
      event.receiverId = event.tiraid.radioDecodings[0].identifier.value;
      event.rssi = event.tiraid.radioDecodings[0].rssi;
      return;
    }


    // Merge any previous device event with the given one
    function mergeDeviceEvents(device, event) {
      device.event.deviceAssociationIds = event.deviceAssociationIds ||
                                          device.event.deviceAssociationIds;
      device.event.deviceUrl = event.deviceUrl || device.event.deviceUrl;
      device.event.deviceTags = event.deviceTags || device.event.deviceTags;
      device.event.receiverId = event.receiverId;
      device.event.receiverUrl = event.receiverUrl;
      device.event.receiverTags = event.receiverTags;
      device.event.receiverDirectory = event.receiverDirectory;
      device.event.rssi = event.rssi;
      device.event.rssiType = event.rssiType;
    }


    // Handle any registered callbacks for the given event type
    function handleEventCallback(type, device) {
      var callback = eventCallbacks[type];
      if(callback) {
        callback(device);
      }
    }


    // Register a callback for the given event type
    var setEventCallback = function(event, callback) {
      if(callback && (typeof callback === 'function')) { 
        eventCallbacks[event] = callback;
      }
    }


    // Handle incoming socket events by type
    var handleSocketEvents = function(Socket) {

      Socket.on('appearance', function(event) {
        updateDevice('appearance', event);
      });

      Socket.on('displacement', function(event) {
        updateDevice('displacement', event);
      });

      Socket.on('keep-alive', function(event) {
        updateDevice('keep-alive', event);
      });

      Socket.on('disappearance', function(event) {
        updateDevice('disappearance', event);
      });

      Socket.on('error', function(err, data) {
      });
    };


    return {
      listen: handleSocketEvents,
      on: setEventCallback,
      getDevices: function() { return devices; },
      getStats: function() { return stats; }
    }
  });
