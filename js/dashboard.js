/**
 * Copyright reelyActive 2016-2017
 * We believe in an open Internet of Things
 */


// Constant definitions
DEFAULT_SOCKET_URL = 'https://www.hyperlocalcontext.com/';
DEFAULT_POLLING_URL = 'https://www.hyperlocalcontext.com/contextat/directory/notman';
DEFAULT_POLLING_MILLISECONDS = 5000;
DEFAULT_ASSOCIATIONS_URL = 'https://www.hyperlocalcontext.com/associations/';
EVENT_HISTORY = 4;


/**
 * dashboard Module
 * All of the JavaScript specific to the dashboard is contained inside this
 * angular module.  The only external dependencies are:
 * - beaver (reelyActive)
 */
angular.module('dashboard', ['reelyactive.beaver'])


/**
 * DashCtrl Controller
 * Handles the manipulation of all variables accessed by the HTML view.
 */
.controller('DashCtrl', function($scope, beaver) {
  var socket = io.connect(DEFAULT_SOCKET_URL);

  // Variables accessible in the HTML scope
  $scope.devices = beaver.getDevices();
  $scope.stats = beaver.getStats();
  $scope.events = [];

  // beaver.js can listen on the websockets OR poll for events
  //   (unlikely you'd want to do both, but shown here as an example)
  beaver.listen(socket, { disappearanceMilliseconds: 20000 });
  beaver.poll(DEFAULT_POLLING_URL, DEFAULT_POLLING_MILLISECONDS);

  // Handle events pre-processed by beaver.js
  beaver.on('appearance', function(event) {
    handleEvent(event);
  });
  beaver.on('displacement', function(event) {
    handleEvent(event);
  });
  beaver.on('keep-alive', function(event) {
    handleEvent(event);
  });
  beaver.on('disappearance', function(event) {
    handleEvent(event);
  });

  // Handle an event
  function handleEvent(event) {
    var length = $scope.events.unshift(event);
    if (length > EVENT_HISTORY) {
      $scope.events.pop();
    }
  }

});
