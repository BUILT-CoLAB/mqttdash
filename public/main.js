document.addEventListener('DOMContentLoaded', function () {
    const elems = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(elems, {});
});

// Create a client instance
client = new Paho.MQTT.Client("smarthub.iot.lan", Number(9001), "mqtt");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect, onFailure: onFailure });


// called when the client connects
function onConnect() {
    // Once a connection has been made
    console.log("onConnect");
    for (const element of document.getElementsByClassName("mqtt-topic")) {
        client.subscribe(element.id)
    }
}

function onFailure(responseObject) {
    // Once a connection has failed
    console.log("onFailure");
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}


function sendMessage(topic, payload) {
    console.log("sendMessage");
    message = new Paho.MQTT.Message(payload);
    message.destinationName = topic;
    client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

async function update(elementId, value) {
    let elementCard = document.getElementById(elementId)
    elementCard.getElementsByClassName("mqtt-payload")[0].textContent = value.toUpperCase()
    let colorattribute = Object.assign({}, elementCard.dataset)
    console.log(colorattribute)
    if (Object.keys(colorattribute).length > 0) {
        elementCard.classList.remove("red", "yellow", "blue", "pink", "orange")
        elementCard.classList.add(colorattribute[value.toString().toLowerCase()])
    }
}

// called when a message arrives
function onMessageArrived(message) {
    //console.log("topic:" + message.destinationName);
    //console.log("content:" + message.payloadString);
    console.log(message.payloadString)
    update(message.destinationName, message.payloadString.toLowerCase())
}