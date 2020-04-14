beaver
======

Client-side library to collect a real-time stream of events from reelyActive APIs.  __beaver.js__ will collect a data stream of _who/what is where/how_ from a server (ex: [hlc-server](https://github.com/reelyactive/hlc-server)), making this real-time information available to the web application.


Installation
------------

__beaver.js__ is written in vanilla JavaScript and the file can simply be included among the scripts in an HTML file.  For example:

```html
<html>
  <head></head>
  <body>
    <script src="js/beaver.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
```


Hello beaver
------------

Include in your _js/app.js_ the following code:

```javascript
beaver.on('raddec', function(raddec) {
  console.log(raddec);
});
```

This will log to the console each [raddec](https://github.com/reelyactive/raddec) received by __beaver.js__.  In this example, no raddec events will occur until __beaver.js__ is provide a _stream_ of such events, as described next.



Beavers love streams!
---------------------

__beaver.js__ can listen to any source of _raddec_ events.

### socket.io stream

Include the [socket.io library](https://socket.io/) in the HTML file:

```html
<html>
  <head></head>
  <body>
    <script src="js/socket.io.slim.js"></script>
    <script src="js/beaver.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
```

Add a connection to the socket.io stream for beaver in the JavaScript app:

```javascript
let socket = io.connect('http://localhost:3001');
beaver.listen(socket);
```

For a source of test data, [run the barnacles socket.io example](https://github.com/reelyactive/barnacles/#example-socketio-push-api).


![beaver logo](https://reelyactive.github.io/beaver/images/beaver-bubble.png)


What's in a name?
-----------------

After humans, beavers are the animals with the greatest impact on their ecosystem.  Industrious and ingenious hydrological engineers, beavers build dams, filling the ponds which provide them food and protection.  In turn, these basins of water provide food and habitat for diverse fauna and flora, contributing to a thriving ecosystem.

Introduced to the web browser habitat in 2016, beaver.js has adapted to fill ponds in your computer’s memory, collecting the steady stream of real-time events from an upstream source.  In turn, this pool of data provides a staple food for other client-side Javascript species such as the occasional migratory [cormorant.js](https://github.com/reelyactive/cormorant).

Oh yeah, and the beaver is the [national animal of Canada](https://en.wikipedia.org/wiki/National_symbols_of_Canada) eh?  And the oversized rodent is currently celebrating its 40th anniversary as the [mascot of the 1976 Olympics](https://en.wikipedia.org/wiki/Amik) of our native Montreal.  We wood be dammed not to chews it as a mascot!

Don’t like our punny ending?  Why not _lodge_ a complaint?


What's next?
------------

__bever.js__ v1.0.0 was released in July 2019, superseding all earlier versions, the latest of which remains available in the [release-0.1 branch](https://github.com/reelyactive/beaver/tree/release-0.1).


License
-------

MIT License

Copyright (c) 2016-2020 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
