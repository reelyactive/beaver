/**
 * Copyright reelyActive 2016-2019
 * We believe in an open Internet of Things
 */


// Constant definitions
const DEFAULT_SOCKET_URL = 'http://localhost:3001/';
const NUMBER_OF_RADDECS_TO_DISPLAY = 12;


// DOM elements
let raddecs = document.querySelector('#raddecs');
let tbody = raddecs.querySelector('tbody');
let socketioUrl = document.querySelector('#socketioUrl')
let connectButton = document.querySelector('#connectButton');


// Non-disappearance events
beaver.on([ 0, 1, 2, 3 ], function(raddec) {
  let tr = document.getElementById(raddec.transmitterId);
  insertRaddec(raddec, true);
});

// Disappearance events
beaver.on([ 4 ], function(raddec) {
  let tr = document.getElementById(raddec.transmitterId);
  if(tr) {
    tr.remove();
  }
});

// Update an existing raddec in the DOM
function updateRaddec(raddec, tr) {
  let tds = tr.getElementsByTagName('td');
  tds[1].textContent = raddec.events;
  tds[2].textContent = raddec.rssiSignature[0].receiverId;
  tds[3].textContent = raddec.rssiSignature[0].rssi;
  tds[4].textContent = raddec.rssiSignature[0].numberOfDecodings;
  tds[5].textContent = raddec.rssiSignature.length;
  tds[6].textContent = raddec.packets.length;
  tds[7].textContent = new Date(raddec.timestamp).toLocaleTimeString();
}

// Insert a raddec into the DOM as a <tr>
function insertRaddec(raddec, prepend) {
  let tr = document.createElement('tr');
  tr.setAttribute('id', raddec.transmitterId);
  tr.setAttribute('class', 'monospace');

  appendTd(tr, raddec.transmitterId, 'text-right');
  appendTd(tr, raddec.events, 'text-center');
  appendTd(tr, raddec.rssiSignature[0].receiverId, 'text-right');
  appendTd(tr, raddec.rssiSignature[0].rssi, 'text-right');
  appendTd(tr, raddec.rssiSignature[0].numberOfDecodings, 'text-center');
  appendTd(tr, raddec.rssiSignature.length, 'text-center');
  appendTd(tr, raddec.packets.length, 'text-center');
  appendTd(tr, new Date(raddec.timestamp).toLocaleTimeString(), 'text-center');

  if(prepend) {
    tbody.prepend(tr);
    if(tbody.childElementCount > NUMBER_OF_RADDECS_TO_DISPLAY) {
      tbody.removeChild(tbody.lastChild);
    }
  }
  else {
    tbody.appendChild(tr);
  }
}

// Append a <td> with the given content to the given <tr>
function appendTd(tr, text, classNames) {
  let td = document.createElement('td');
  let cell = document.createTextNode(text);
  td.appendChild(cell);
  tr.appendChild(td);
  if(classNames) {
    td.setAttribute('class', classNames);
  }
}

// Handle connect button click
connectButton.addEventListener('click', function() {
  if(socketioUrl.value && (socketioUrl.value.indexOf('http') === 0)) {
    let socket = io.connect(socketioUrl.value);
    beaver.listen(socket, { printStatus: true });
  }
  else {
    socketioUrl.value = null;
    socketioUrl.setAttribute('placeholder', 'Enter a valid URL');
  }
});
