// Create a client instance
const clientID = `web${new Date().getTime()}`;
const client = new Paho.Client('example.com', Number(9001), clientID);

// called when the client connects
function onConnect() {
  // Once a connection has been made
  console.info('onConnect');
  for (const element of document.getElementsByClassName('mqtt-topic')) {
    console.log('Subscribed to: ', element.id);
    client.subscribe(element.id);
  }
}

function onFailure(responseObject) {
  // Once a connection has failed
  console.info('onFailure');
  if (responseObject.errorCode !== 0) {
    console.error(`onConnectionLost: ${responseObject.errorMessage}`);
  }
}

// connect the client
client.connect({
  onSuccess: onConnect, onFailure, reconnect: true, keepAliveInterval: 30,
});

// eslint-disable-next-line no-unused-vars
function sendMessage(topic, payload, retained = false) {
  console.info('sendMessage');
  const message = new Paho.Message(payload);
  message.destinationName = topic;
  message.retained = retained;
  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.error(`onConnectionLost:${responseObject.errorMessage}`);
  }
}

async function update(elementId, value) {
  const elementCard = document.getElementById(elementId);
  elementCard.getElementsByClassName('mqtt-payload')[0].textContent = value.toUpperCase();
  if (elementCard.getElementsByClassName('units')[0]) {
    elementCard.getElementsByClassName('units')[0].style.display = 'inline';
  }
  const colorattribute = { ...elementCard.dataset };
  // console.log(colorattribute)
  if (Object.keys(colorattribute).length > 0) {
    elementCard.classList.remove('red', 'yellow', 'blue', 'pink', 'orange', 'green', 'teal', 'blue-grey', 'grey');
    elementCard.classList.add(colorattribute[value.toString().toLowerCase()]);
  } else {
    elementCard.classList.add('grey');
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.info(message.destinationName, message.payloadString);
  update(message.destinationName, message.payloadString.toLowerCase());
}

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

function setVisibleByCat(category) {
  for (const el of [...document.querySelectorAll('.column')]) {
    if ([...document.querySelectorAll('.column')].filter((elfil) => elfil.classList.contains(category)).length === 0) {
      el.classList.remove('column-hidden');
    } else if (el.classList.contains(category)) {
      el.classList.remove('column-hidden');
    } else {
      el.classList.add('column-hidden');
    }
    for (const elbtn of [...document.querySelectorAll('.category-btn')]) {
      if (elbtn.dataset.category === category) {
        elbtn.parentElement.classList.add('is-active');
      } else {
        elbtn.parentElement.classList.remove('is-active');
      }
    }
  }
}

document.querySelectorAll('.category-btn').forEach((item) => {
  item.addEventListener('click', (event) => {
    const { category } = event.target.dataset;
    location.hash = category;
    setVisibleByCat(category);
  });
});

if (window.location.hash) {
  const hash = location.hash.substring(1);
  setVisibleByCat(hash);
} else {
  const { category } = document.querySelectorAll('.is-active')[0].children[0].dataset;
  location.hash = category;
  setVisibleByCat(category);
}
