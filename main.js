// Create a client instance
const clientID = "web" + new Date().getTime();
client = new Paho.Client("smarthub.dev.lan", Number(9001), clientID);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// called when the client connects
function onConnect() {
    // Once a connection has been made
    console.info("onConnect");
    for (const element of document.getElementsByClassName("mqtt-topic")) {
        client.subscribe(element.id);
    }
}

function onFailure(responseObject) {
    // Once a connection has failed
    console.info("onFailure");
    if (responseObject.errorCode !== 0) {
        console.error(`onConnectionLost: ${responseObject.errorMessage}`);
    }
}

// connect the client
client.connect({
    onSuccess: onConnect, onFailure: onFailure, reconnect: true, keepAliveInterval: 30
});

function sendMessage(topic, payload, retained = false) {
    console.info("sendMessage");
    message = new Paho.Message(payload);
    message.destinationName = topic;
    message.retained = retained;
    client.send(message);
}


// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.error("onConnectionLost:" + responseObject.errorMessage);
    }
}

async function update(elementId, value) {
    let elementCard = document.getElementById(elementId)
    elementCard.getElementsByClassName("mqtt-payload")[0].textContent = value.toUpperCase()
    let colorattribute = Object.assign({}, elementCard.dataset)
    console.log(colorattribute)
    if (Object.keys(colorattribute).length > 0) {
        elementCard.classList.remove("red", "yellow", "blue", "pink", "orange", "green", "teal", "blue-grey", "grey")
        elementCard.classList.add(colorattribute[value.toString().toLowerCase()])
    } else {
        elementCard.classList.add("grey")
    }
}

// called when a message arrives
function onMessageArrived(message) {
    //console.info(message.destinationName, message.payloadString)
    update(message.destinationName, message.payloadString.toLowerCase())
}
