beaver
======

Collects the real-time location of devices from reelyActive APIs via websockets or polling. We believe in an open Internet of Things.


Hello beaver
------------

```javascript
angular.module('appName', [ 'reelyactive.beaver' ])

  .controller('EventsCtrl', function($scope, beaver) {
    console.log(beaver.getStats());
    console.log(beaver.getDevices());
    beaver.on('appearance', function(device) {
      console.log(device);
    });
  });
```

Include the above in a .js file, and then source both that file and beaver.js in an HTML file.  Upon running the HTML file, the stats and devices will be output to the console.

Instructions on how to listen on websockets or poll an API to come soon!


Devices
-------

All the devices currently detected by beaver can be obtained via the getDevices() function.  The associations for each device and the receivers of its transmissions will be automatically fetched by beaver.  For instance, getDevices() would return an object such as:

    {
      "fee150bada55":
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
        ],
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
