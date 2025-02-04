/**
 * Copyright reelyActive 2016-2025
 * We believe in an open Internet of Things
 */


// Constant definitions
const DEFAULT_URL = 'http://pareto.local';


// DOM elements
let connectIcon = document.querySelector('#connectIcon');
let exampleUrl = document.querySelector('#exampleUrl');
let paretoUrl = document.querySelector('#paretoUrl');
let paretoButton = document.querySelector('#paretoButton');
let errorDisplay = document.querySelector('#errorDisplay');
let errorMessage = document.querySelector('#errorMessage');
let errorTime = document.querySelector('#errorTime');
let statsDisplay = document.querySelector('#statsDisplay');
let deviceCount =  document.querySelector('#deviceCount');
let raddecRate = document.querySelector('#raddecRate');
let dynambRate = document.querySelector('#dynambRate');
let spatemRate = document.querySelector('#spatemRate');
let staleSeconds = document.querySelector('#staleSeconds');

exampleUrl.textContent = DEFAULT_URL;
paretoUrl.value = DEFAULT_URL;

// Handle beaver events
beaver.on('connect', handleConnect);
beaver.on('stats', handleStats);
beaver.on('error', handleError);
beaver.on('disconnect', handleDisconnect);

// Handle stream connection
function handleConnect() {
  statsDisplay.hidden = false;
  connectIcon.replaceChildren(createElement('i', 'fas fa-cloud text-success'));
}

// Handle stream disconnection
function handleDisconnect() {
  statsDisplay.hidden = true;
  connectIcon.replaceChildren(createElement('i', 'fas fa-cloud text-warning'));
}

// Handle error
function handleError(error) {
  errorDisplay.hidden = false;
  errorMessage.textContent = error.message;
  errorTime.textContent = new Date().toLocaleTimeString();
  connectIcon.replaceChildren(createElement('i', 'fas fa-cloud text-danger'));
}

// Handle stats
function handleStats(stats) {
  deviceCount.textContent = stats.numberOfDevices;
  raddecRate.textContent = stats.eventsPerSecond.raddec.toFixed(1);
  dynambRate.textContent = stats.eventsPerSecond.dynamb.toFixed(1);
  spatemRate.textContent = stats.eventsPerSecond.spatem.toFixed(1);
  staleSeconds.textContent = (stats.averageEventStaleMilliseconds /
                              1000).toFixed(1);
}

// Create an element as specified
function createElement(elementName, classNames, content) {
  let element = document.createElement(elementName);

  if(classNames) {
    element.setAttribute('class', classNames);
  }

  if((content instanceof Element) || (content instanceof DocumentFragment)) {
    element.appendChild(content);
  }
  else if(Array.isArray(content)) {
    content.forEach((item) => {
      if((item instanceof Element) || (item instanceof DocumentFragment)) {
        element.appendChild(item);
      }
      else {
        element.appendChild(document.createTextNode(item));
      }
    });
  }
  else if(content) {
    element.appendChild(document.createTextNode(content));
  }

  return element;
}

// Handle Pareto URL input
paretoUrl.addEventListener('input', () => {
    exampleUrl.textContent = paretoUrl.value;
});

// Handle Pareto button click
paretoButton.addEventListener('click', () => {
    beaver.stream(paretoUrl.value, { io: io, reviseTimestamps: true });
});
