/**
 * Copyright reelyActive 2016-2023
 * We believe in an open Internet of Things
 */


// Constant definitions
const DEFAULT_URL = 'http://pareto.local';


// DOM elements
let paretoUrl = document.querySelector('#paretoUrl');
let paretoButton = document.querySelector('#paretoButton');
let statsDisplay = document.querySelector('#statsDisplay');
let deviceCount =  document.querySelector('#deviceCount');
let raddecRate = document.querySelector('#raddecRate');
let dynambRate = document.querySelector('#dynambRate');
let spatemRate = document.querySelector('#spatemRate');


paretoUrl.value = DEFAULT_URL;


// Handle beaver events
beaver.on('connect', handleConnect);
beaver.on('stats', handleStats);


// Handle stream connection
function handleConnect() {
  statsDisplay.hidden = false;
}

// Handle stats
function handleStats(stats) {
  deviceCount.textContent = stats.numberOfDevices;
  raddecRate.textContent = stats.eventsPerSecond.raddec.toFixed(1);
  dynambRate.textContent = stats.eventsPerSecond.dynamb.toFixed(1);
  spatemRate.textContent = stats.eventsPerSecond.spatem.toFixed(1);
}


// Handle Pareto button click
paretoButton.addEventListener('click', () => {
    beaver.stream(paretoUrl.value, { io: io });
});
