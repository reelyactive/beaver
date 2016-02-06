/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */

angular.module('reelyactive.beaver', [])

  .factory('beaver', function beaverFactory($http) {

    var devices = {};
    var stats = { appearances: 0, displacements: 0, keepalives: 0,
                  disappearances: 0 };

    function updateDevice(event, data) {
      if(!data || !data.tiraid) {
        return;
      }

      var tiraid = data.tiraid;
      if(!tiraid || !tiraid.identifier || !tiraid.identifier.value) {
        return;
      }

      var id = tiraid.identifier.value;
      if(event === 'disappearance') {
        if(devices.hasOwnProperty(id)) {
          // TODO: cache url and stats?
          delete devices[id];
        }
        stats.disappearances++;
        return;
      }

      if(!devices.hasOwnProperty(id)) {
        devices[id] = { tiraid: tiraid };
      }
      else {
        devices[id].tiraid = tiraid;
      }

      var device = devices[id];
      if(!device.hasOwnProperty('url')) {
        // TODO: fetch association
      }

      if(event === 'appearance') { stats.appearances++; }
      if(event === 'displacement') { stats.displacements++; }
      if(event === 'keep-alive') { stats.keepalives++; }
    }

    var handleSocketEvents = function(Socket) {

      Socket.on('appearance', function(data) {
        updateDevice('appearance', data);
      });

      Socket.on('displacement', function(data) {
        updateDevice('displacement', data);
      });

      Socket.on('keep-alive', function(data) {
        updateDevice('keep-alive', data);
      });

      Socket.on('disappearance', function(data) {
        updateDevice('disappearance', data);
      });

      Socket.on('error', function(err, data) {
      });
    };

    return {
      listen: handleSocketEvents,
      getDevices: function() { return devices; },
      getStats: function() { return stats; }
    }
  });
