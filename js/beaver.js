/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */


DEFAULT_ASSOCIATIONS_API_URL = 'http://www.hyperlocalcontext.com/associations/';


angular.module('reelyactive.beaver', [])

  .factory('beaver', function beaverFactory($http) {

    var devices = {};
    var associations = {};
    var stats = { appearances: 0, displacements: 0, keepalives: 0,
                  disappearances: 0 };
    var associationsApiUrl = DEFAULT_ASSOCIATIONS_API_URL;
    var eventCallbacks = {};


    function updateDevice(type, event) {
      if(!event || !event.tiraid) {
        return;
      }

      var tiraid = event.tiraid;
      if(!tiraid || !tiraid.identifier || !tiraid.identifier.value) {
        return;
      }

      var id = tiraid.identifier.value;
      if(type === 'disappearance') {
        if(devices.hasOwnProperty(id)) {
          // TODO: cache stats?
          delete devices[id];
        }
        stats.disappearances++;
        handleEventCallback(type, event);
        return;
      }

      if(!devices.hasOwnProperty(id)) {
        devices[id] = { tiraid: tiraid };
      }
      else {
        devices[id].tiraid = tiraid;
      }

      var device = devices[id];
      if(!device.hasOwnProperty('associations')) {
        getAssociations(id, function(id, associations) {
          if(devices.hasOwnProperty(id)) {
            devices[id].associations = associations;
          }
        });
      }
      addReceiverAssociations(tiraid);

      if(type === 'appearance') { stats.appearances++; }
      if(type === 'displacement') { stats.displacements++; }
      if(type === 'keep-alive') { stats.keepalives++; }
      handleEventCallback(type, device);
    }


    function getAssociations(id, callback) {
      if(associations.hasOwnProperty(id)) {
        return callback(id, associations[id]);
      }
      associations[id] = {};
      $http.defaults.headers.common.Accept = 'application/json';
      $http.get(associationsApiUrl + id)
        .success(function(data, status, headers, config) {
          if(data.devices && data.devices[id]) {
            associations[id] = data.devices[id];
          }
          return callback(id, associations[id]);
        })
        .error(function(data, status, headers, config) {
          return callback(id, associations[id]);
        });
    }


    function addReceiverAssociations(tiraid) {
      for(var cDecoding = 0; cDecoding < tiraid.radioDecodings.length;
          cDecoding++) {
        var decoding = tiraid.radioDecodings[cDecoding];
        var decoderId = decoding.identifier.value;
        if(associations.hasOwnProperty(decoderId)) {
          decoding.associations = associations[decoderId];
        }
        else {
          getAssociations(decoderId, function(id, associations) {});
        }
      }
    }


    function handleEventCallback(type, device) {
      var callback = eventCallbacks[type];
      if(callback) {
        callback(device);
      }
    }


    var setEventCallback = function(event, callback) {
      if(callback && (typeof callback === 'function')) { 
        eventCallbacks[event] = callback;
      }
    }


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
