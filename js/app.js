/**
 * Copyright reelyActive 2016-2019
 * We believe in an open Internet of Things
 */


// Constant definitions
const DEFAULT_SOCKET_URL = 'http://localhost:3001/';
const NUMBER_OF_RADDECS_TO_DISPLAY = 12;
const RDPS = ' / ';
const EVENT_ICONS = [
    'fas fa-sign-in-alt',
    'fas fa-route',
    'fas fa-info',
    'fas fa-heartbeat',
    'fas fa-sign-out-alt'
];


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
  updateNode(tds[1], prepareEvents(raddec));
  updateNode(tds[2], raddec.rssiSignature[0].receiverId);
  updateNode(tds[3], raddec.rssiSignature[0].rssi);
  updateNode(tds[4], prepareRecDecPac(raddec));
  updateNode(tds[5], new Date(raddec.timestamp).toLocaleTimeString());
}

// Insert a raddec into the DOM as a <tr>
function insertRaddec(raddec, prepend) {
  let tr = document.createElement('tr');
  tr.setAttribute('id', raddec.transmitterId);
  tr.setAttribute('class', 'monospace');

  appendTd(tr, raddec.transmitterId, 'text-right');
  appendTd(tr, prepareEvents(raddec), 'text-center');
  appendTd(tr, raddec.rssiSignature[0].receiverId, 'text-right');
  appendTd(tr, raddec.rssiSignature[0].rssi, 'text-right');
  appendTd(tr, prepareRecDecPac(raddec), 'text-center');
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
function appendTd(tr, content, classNames) {
  let td = document.createElement('td');
  updateNode(td, content);
  tr.appendChild(td);
  if(classNames) {
    td.setAttribute('class', classNames);
  }
}

// Update the given node with the given content
function updateNode(node, content, append) {
  append = append || false;

  while(!append && node.firstChild) {
    node.removeChild(node.firstChild);
  }

  if(content instanceof Element) {
    node.appendChild(content);
  }
  else if(content instanceof Array) {
    content.forEach(function(element) {
      node.appendChild(element);
    });
  }
  else {
    node.textContent = content;
  }
}

// Prepare the event icons
function prepareEvents(raddec) {
  let elements = [];

  raddec.events.forEach(function(event) {
    let i = document.createElement('i');
    let space = document.createTextNode(' ');
    i.setAttribute('class', EVENT_ICONS[event]);
    elements.push(i);
    elements.push(space);
  });

  return elements;
}

// Prepare the receivers-decodings-packets string
function prepareRecDecPac(raddec) {
  let maxNumberOfDecodings = 0;

  raddec.rssiSignature.forEach(function(signature) {
    if(signature.numberOfDecodings > maxNumberOfDecodings) {
      maxNumberOfDecodings = signature.numberOfDecodings;
    }
  });

  return raddec.rssiSignature.length + RDPS + maxNumberOfDecodings + RDPS +
         raddec.packets.length;
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
