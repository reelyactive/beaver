/**
 * Copyright reelyActive 2016-2017
 * We believe in an open Internet of Things
 */


// Constant definitions
DEFAULT_SOCKET_URL = 'https://www.hyperlocalcontext.com/';
DEFAULT_POLLING_URL = 'https://www.hyperlocalcontext.com/contextat/directory/notman';
DEFAULT_POLLING_MILLISECONDS = 5000;
DEFAULT_BEAVER_OPTIONS = {
  disappearanceMilliseconds: 20000,
  mergeEvents: false,
  maintainDirectories: true
};
DEFAULT_DIRECTORY_ID = 'Unspecified';
DEFAULT_SAMPLE_PERIOD = 2000;
EVENT_HISTORY = 10;


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
.controller('DashCtrl', function($scope, $interval, beaver) {
  var socket = io.connect(DEFAULT_SOCKET_URL);
  var directories = beaver.getDirectories();

  // Variables accessible in the HTML scope
  $scope.devices = beaver.getDevices();
  $scope.stats = beaver.getStats();
  $scope.directories = [];
  $scope.events = [];

  // beaver.js can listen on the websockets OR poll for events
  //   (unlikely you'd want to do both, but shown here as an example)
  beaver.listen(socket, DEFAULT_BEAVER_OPTIONS);
  beaver.poll(DEFAULT_POLLING_URL, DEFAULT_POLLING_MILLISECONDS,
              DEFAULT_BEAVER_OPTIONS);

  // Handle events pre-processed by beaver.js
  beaver.on('appearance', handleEvent);
  beaver.on('displacement', handleEvent);
  beaver.on('keep-alive', handleEvent);
  beaver.on('disappearance', handleEvent);

  // Handle an event
  function handleEvent(event) {
    var length = $scope.events.unshift(event);
    if (length > EVENT_HISTORY) {
      $scope.events.pop();
    }
  }

  // Sample the current state of the directories
  function sampleDirectories() {
    var directoryArray = [];

    for(id in directories) {
      var directory = directories[id];
      if(id !== 'null') {
        directory.id = id;
      }
      else {    
        directory.id = DEFAULT_DIRECTORY_ID;
      } 
      directory.receiverCount = Object.keys(directory.receivers).length;
      directory.deviceCount = Object.keys(directory.devices).length;
      directoryArray.push(directory);
    }

    $scope.directories = directoryArray;
  }

  $interval(sampleDirectories, DEFAULT_SAMPLE_PERIOD);
});
