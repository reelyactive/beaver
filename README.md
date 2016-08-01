beaver
======

Collects the real-time state of devices from reelyActive APIs via websockets or polling. We believe in an open Internet of Things.


In the scheme of Things (pun intended)
--------------------------------------

The __beaver.js__, [cormorant.js](https://github.com/reelyactive/cormorant) and [cuttlefish.js](https://github.com/reelyactive/cuttlefish) modules work together as a unit.  See our [dashboard-template-angular](https://github.com/reelyactive/dashboard-template-angular) for a minimal implementation.


![beaver logo](http://reelyactive.github.io/beaver/images/beaver-bubble.png)


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

    $scope.stats = beaver.getStats();
    $scope.devices = beaver.getDevices();

    beaver.listen( /* socket.io */ );

    beaver.on('appearance', function(device) {
      console.log(device.tiraid.identifier.value + ' appeared');
    });
    beaver.on('keep-alive', function(device) {
      console.log(device.tiraid.identifier.value + ' is staying alive');
    });
    beaver.on('displacement', function(device) {
      console.log(device.tiraid.identifier.value + ' displaced');
    });
    beaver.on('disappearance', function(device) {
      console.log(device.tiraid.identifier.value + ' disappeared');
    });
  });
```

Include the above in a .js file, and then source both that file and beaver.js in an HTML file.  Upon running the HTML file, the real-time events will be output to the console.

Instructions on how to listen on websockets or poll an API to come soon - see [dashboard-template-angular](https://github.com/reelyactive/dashboard-template-angular) for a working example.


Devices
-------

All the devices currently detected by beaver can be obtained via the getDevices() function.  The associations for each device and the receivers of its transmissions will be automatically fetched by beaver.  For instance, getDevices() would return an object such as:

    {
      "fee150bada55":
        "tiraid": {
          "identifier": {
            "type": "ADVA-48",
            "value": "fee150bada55",
            "advHeader": { /* ... */ },
            "advData": { /* ... */ }
          }
          "timestamp": "2014-01-01T01:23:45.678Z",
          "radioDecodings": [
            {
              "rssi": 128,
              "identifier": {
                "type": "EUI-64",
                "value": "001bc50940800000"
              },
              "associations": {
                "directory": "dam:entrance"
              }
            }
          ]
        },
        "associations": {
          "url": "http://reelyactive.com/"
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
      "disappearances": 68
    }



License
-------

MIT License

Copyright (c) 2016 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
