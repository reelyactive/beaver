/**
 * Copyright reelyActive 2016
 * We believe in an open Internet of Things
 */


// Constant definitions
DEFAULT_SOCKET_URL = 'http://www.hyperlocalcontext.com/notman';
DEFAULT_ASSOCIATIONS_URL = 'http://www.hyperlocalcontext.com/associations/';
EVENT_HISTORY = 4;


/**
 * dashboard Module
 * All of the JavaScript specific to the dashboard is contained inside this
 * angular module.  The only external dependencies are:
 * - beaver (reelyActive)
 * - socket.io (btford)
 * - ngSanitize (angular)
 */
angular.module('dashboard', ['btford.socket-io', 'reelyactive.beaver',
                             'ngSanitize'])


/**
 * Socket Factory
 * Creates the websocket connection to the given URL using socket.io.
 */
.factory('Socket', function(socketFactory) {
  return socketFactory({
    ioSocket: io.connect(DEFAULT_SOCKET_URL)
  });
})


/**
 * DashCtrl Controller
 * Handles the manipulation of all variables accessed by the HTML view.
 */
.controller('DashCtrl', function($scope, Socket, beaver) {

  // Variables accessible in the HTML scope
  $scope.devices = beaver.getDevices();
  $scope.stats = beaver.getStats();
  $scope.events = [];

  // beaver.js listens on the websocket for events
  beaver.listen(Socket);

  // Handle events pre-processed by beaver.js
  beaver.on('appearance', function(data) {
    handleEvent('appearance', data);
  });
  beaver.on('displacement', function(data) {
    handleEvent('displacement', data);
  });
  beaver.on('keep-alive', function(data) {
    handleEvent('keep-alive', data);
  });
  beaver.on('disappearance', function(data) {
    handleEvent('disappearance', data);
  });

  // Handle an event
  function handleEvent(type, data) {
    var length = $scope.events.unshift({
      type: type,
      tiraid: data.tiraid,
      associations: data.associations
    });
    if (length > EVENT_HISTORY) {
      $scope.events.pop();
    }
  }

});
