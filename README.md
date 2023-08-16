beaver.js
=========

__beaver__ maintains an up-to-date [hyperlocal context](https://www.reelyactive.com/context/) graph by consuming the real-time data stream from [Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere/) APIs.

![Overview of beaver.js](https://reelyactive.github.io/beaver/images/overview.png)

__beaver__ is lightweight client-side JavaScript that runs in the browser.  See a live demo using the code in this repository at: [reelyactive.github.io/beaver](https://reelyactive.github.io/beaver)


Hello beaver!
-------------

Include in an _index.html_ file the __beaver.js__ script:

```html
<html>
  <head></head>
  <body>
    <script src="js/beaver.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
```

Include in a _js/app.js_ the code to connect to a Pareto Anywhere instance:

```javascript
beaver.stream('http://pareto.local', { /* Options: see below */ });
```

Open the _index.html_ file in a web browser for __beaver__ to connect to the Pareto Anywhere instance and begin maintaining the hyperlocal context graph.


Supported functions
-------------------

### stream

```javascript
let serverRootUrl = 'http://pareto.local';
let options = { /* See below */ };

let streams = beaver.stream(serverRootUrl, options);
```

If the serverRootUrl is provided, and valid, __beaver__ will HTTP GET the /context route once to establish the hyperlocal context graph.  The options are as follows:

| Property        | Default | Description                                     |
|:----------------|:--------|:------------------------------------------------|
| deviceSignature | null    | Specific device to stream (default all devices) |
| io              | null    | Socket.IO dependency                            |
| ioUrl           | null    | Override default URL for Socket.IO to listen on |
| wsUrl           | null    | Specific URL for WebSocket to listen on         |

For example, to stream using Socket.IO from a [Pareto Anywhere](https://github.com/reelyactive/pareto-anywhere/) server at pareto.local, filtering for a specific device:

```javascript
// Include <script src="js/socket.io.min.js"></script> in the index.html
let options = { deviceSignature: "bada55beac04/2", io: io };

beaver.stream('http://pareto.local', options);
```

For example, to stream using WebSockets from a [Pareto Anywhere for Azure](https://github.com/reelyactive/pareto-anywhere-azure/) server at pareto-anywhere.azurewebsites.net:

```javascript
let options = { wsUrl: 'ws://pareto-anywhere.azurewebsites.net' };

beaver.stream(null, options);
```


### poll

```javascript
let serverRootUrl = 'http://pareto.local';
let options = { intervalMilliseconds: 5000 }; // {} to instead poll just once

beaver.poll(serverRootUrl, options);
```

Use `beaver.on('poll')` as notification of when each poll completes and the Map of `beaver.devices` is updated.


### on

```javascript
beaver.on('connect', () => {});
beaver.on('raddec', (raddec) => { /* radio decoding data */ });
beaver.on('dynamb', (dynamb) => { /* dynamic ambient data */ });
beaver.on('spatem', (spatem) => { /* spatial-temporal data */ });
beaver.on('poll' () => { /* beaver.devices is updated */ });
beaver.on('stats', (stats) => {
  // stats = {
  //     numberOfDecodings: Number,
  //     eventsPerSecond: { raddec: Number, dynamb: Number, spatem: Number }
  // }
});
beaver.on('error', (error) => { /* error.message */ });
beaver.on('disconnect', (reason) => { /* disconnect reason */ });
```

Read the [reelyActive Developers Cheatsheet](https://reelyactive.github.io/diy/cheatsheet/) to learn more about the raddec, dynamb & spatem data structures.


Supported variables
-------------------

| Variable         | Type | Description                                       |
|:-----------------|:-----|:--------------------------------------------------|
| `beaver.devices` | Map  | Hyperlocal context graph: device signature as key |


![beaver logo](https://reelyactive.github.io/beaver/images/beaver-bubble.png)


What's in a name?
-----------------

After humans, beavers are the animals with the greatest impact on their ecosystem.  Industrious and ingenious hydrological engineers, beavers build dams, filling the ponds which provide them food and protection.  In turn, these basins of water provide food and habitat for diverse fauna and flora, contributing to a thriving ecosystem.

Introduced to the web browser habitat in 2016, beaver.js has adapted to fill ponds in your computer’s memory, collecting the steady stream of real-time events from an upstream source.  In turn, this pool of data provides a staple food for other client-side Javascript species such as the occasional migratory [cormorant.js](https://github.com/reelyactive/cormorant).

Oh yeah, and the beaver is the [national animal of Canada](https://en.wikipedia.org/wiki/National_symbols_of_Canada) eh?  And the oversized rodent is currently celebrating its 40th anniversary as the [mascot of the 1976 Olympics](https://en.wikipedia.org/wiki/Amik) of our native Montreal.  We wood be dammed not to chews it as a mascot!

Don’t like our punny ending?  Why not _lodge_ a complaint?


Project History
---------------

__beaver__ v2.0.0 was released in February 2023.

__beaver.js__ v1.0.0 was released in July 2019, superseding all earlier versions, the latest of which remains available in the [release-0.1 branch](https://github.com/reelyactive/beaver/tree/release-0.1).


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.

[![Known Vulnerabilities](https://snyk.io/test/github/reelyactive/beaver/badge.svg)](https://snyk.io/test/github/reelyactive/beaver)


License
-------

MIT License

Copyright (c) 2016-2023 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
