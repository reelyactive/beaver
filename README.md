beaver
======

Collects the real-time stream of events from reelyActive APIs via websockets or polling.  We believe in an open Internet of Things.


In the scheme of Things (pun intended)
--------------------------------------

The __beaver.js__, [cormorant.js](https://github.com/reelyactive/cormorant) and [cuttlefish.js](https://github.com/reelyactive/cuttlefish) modules work together as a unit.  See our [dashboard-template-angular](https://github.com/reelyactive/dashboard-template-angular) for a typical implementation.


![beaver logo](https://reelyactive.github.io/beaver/images/beaver-bubble.png)


What's in a name?
-----------------

After humans, beavers are the animals with the greatest impact on their ecosystem.  Industrious and ingenious hydrological engineers, beavers build dams, filling the ponds which provide them food and protection.  In turn, these basins of water provide food and habitat for diverse fauna and flora, contributing to a thriving ecosystem.

Introduced to the web browser habitat in 2016, beaver.js has adapted to fill ponds in your computer’s memory, collecting the steady stream of real-time events from an upstream source.  In turn, this pool of data provides a staple food for other client-side Javascript species such as the occasional migratory [cormorant.js](https://github.com/reelyactive/cormorant).

Oh yeah, and the beaver is the [national animal of Canada](https://en.wikipedia.org/wiki/National_symbols_of_Canada) eh?  And the oversized rodent is currently celebrating its 40th anniversary as the [mascot of the 1976 Olympics](https://en.wikipedia.org/wiki/Amik) of our native Montreal.  We wood be dammed not to chews it as a mascot!

Don’t like our punny ending?  Why not _lodge_ a complaint?


Hello beaver
------------

```javascript
angular.module('appName', [ 'reelyactive.beaver' ])

  .controller('EventsCtrl', function($scope, beaver) {

    // Include socket.io.js in your HTML in order to connect to websockets
    var socket = io.connect('https://www.hyperlocalcontext.com/');
    var options = { /* See Options section below */ };

    $scope.stats = beaver.getStats();
    $scope.devices = beaver.getDevices();
    $scope.directories = beaver.getDirectories();

    // Listen for real-time events via websocket
    beaver.listen(socket, options);

    // Or, alternatively, periodically poll a REST API
    beaver.poll('https://www.hyperlocalcontext.com/contextat/directory/notman',
                5000, options);

    beaver.on('appearance', handleEvent);
    beaver.on('displacement', handleEvent);
    beaver.on('keep-alive', handleEvent);
    beaver.on('disappearance', handleEvent);

    function handleEvent(event) {
      console.log(event.event + ' of ' + event.deviceId + ' at ' +
                  event.receiverId);
    }
  });
```

See [reelyactive.github.io/beaver](https://reelyactive.github.io/beaver/) for a simple working example with code in the [gh-pages branch](https://github.com/reelyactive/beaver/tree/gh-pages).


Events
------

An event is the consequence of an interaction between a radio-identifiable device and receiver infrastructure. The event is the core data structure used in the reelyActive platform.  Our [Event Overview](https://reelyactive.github.io/event-overview.html) page provides the complete reference.



Devices
-------

All the devices currently detected by beaver can be obtained via the getDevices() function.  For instance, getDevices() would return an object containing all the visible devices and the most recent event of each such as:

    {
      "fee150bada55": {
        "event": { /* ... */ }
      },
      "001bc50940100000": {
        "event": { /* ... */ }
      }
    }


Directories
-----------

All the receiver directories detected by beaver, including the receivers and devices currently at each directory, can be obtained via the getDirectories() function.  For instance, getDirectories() would return an object such as:

    {
      "lodge:entrance": {
        "receivers": {
          "001bc50940810000": {
            "receiverId": "001bc50940810000",
            "receiverTags": [ 'test' ],
            "receiverDirectory": "lodge:entrance",
            "receiverUrl": "http://sniffypedia.org/Product/reelyActive_RA-R436/"
          }
        },
        "devices": {
          "fee150bada55": { /* Same as in devices, above */ }
        }
      }
    }


Stats
-----

All the statistics collected by beaver can be obtained via the getStats() function.  For instance, getStats() would return an object such as:

    {
      "appearances": 69,
      "displacements": 7,
      "keepalives": 1999,
      "disappearances": 68,
      "passedFilters": 501,
      "failedFilters": 1642
    }


Options
-------

The following options are supported (those shown are the defaults):

    {
      disappearanceMilliseconds: 15000,
      mergeEvents: false,
      mergeEventProperties: [ 'event', 'time', 'rssi', 'receiverId', 
                              'receiverDirectory', 'receiverUrl',
                              'position', 'sessionDuration',
                              'passedFilters' ],
      retainEventProperties: [ 'event', 'time', 'deviceId', 'deviceTags',
                               'deviceUrl', 'deviceAssociationIds',
                               'rssi', 'receiverId', 'receiverTags',
                               'receiverUrl', 'receiverDirectory',
                               'position', 'sessionId',
                               'sessionDuration', 'passedFilters' ],
      maintainDirectories: false,
      observeOnlyFiltered: false,
      filters: { /* See below */ }
    }

Include the options, if any, in the listen() and poll() functions:

    beaver.listen(socket, options);
    beaver.poll(url, options);

### disappearanceMilliseconds

The maximum staleness of a device's most recent event before that device is considered to have disappeared.

### mergeEvents

When set to _false_, beaver replaces a device's previous event object with the new event object.  When set to _true_, beaver will instead iterate over the event object properties, updating only those which have changed.

Depending on the application and number of events, there may be a measurable performance difference between the two options.

### mergeEventProperties

The list of properties to consider when merging events (see above).  Only the specified properties will be updated.  Note that any unspecified properties are likely to become stale and should therefore be ignored by the application, or omitted from the retainEventProperties list.

### retainEventProperties

The list of event properties to retain, discarding all others.  Specify only the application-specific properties to reduce memory footprint.

### maintainDirectories

When set to _false_, beaver will not update the directories object returned by the getDirectories() function.  Eliminate needless computation by disabling this option should directory functionality be irrelevant.

### observeOnlyFiltered

When set to _true_, beaver will ignore events that do not pass the filter criteria.  Specifically, beaver will not emit such events, nor will it include the concerned devices among the observed devices and directories.  Stats are not affected by this setting.

Enable this option when filters are relevant as it can significantly reduce memory footprint and computation load.


Filters
-------

The following filters are supported (those shown are the defaults):

    {
      minSessionDuration: 0,
      maxSessionDuration: 9007199254740991,
      isPerson: [ 'yes', 'possibly' ],
      whitelistTags: [ 'track' ],
      blacklistTags: [ 'ignore' ]
    }

The setFilters(filters) function allows the filters to be updated at any time.


License
-------

MIT License

Copyright (c) 2016-2018 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
