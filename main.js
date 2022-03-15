// Create a client instance
client = new Paho.MQTT.Client("smarthub.iot.lan", Number(9001), "mqtt");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });


// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    for (const element of document.getElementsByClassName("mqtt-topic")) {
        client.subscribe(element.id)
    }
}

function sendMessage(topic, payload) {
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

// called when a message arrives
function onMessageArrived(message) {
    //console.log("topic:" + message.destinationName);
    //console.log("content:" + message.payloadString);
    document.getElementById(message.destinationName).textContent = message.payloadString
}