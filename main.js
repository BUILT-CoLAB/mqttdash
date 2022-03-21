document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();

    const inc = document.getElementsByClassName("stepper");
    for (i = 0; i < inc.length; i++) {
        var incI = inc[i].querySelector("input"),
            id = incI.getAttribute("id"),
            min = incI.getAttribute("min"),
            max = incI.getAttribute("max"),
            step = incI.getAttribute("step");
        document
            .getElementById(id)
            .previousElementSibling.setAttribute(
                "onclick",
                "stepperInput('" + id + "', -" + step + ", " + min + ")"
            );
        document
            .getElementById(id)
            .nextElementSibling.setAttribute(
                "onclick",
                "stepperInput('" + id + "', " + step + ", " + max + ")"
            );
    }
    function stepperInput(id, s, m) {
        var el = document.getElementById(id);
        if (s > 0) {
            if (parseInt(el.value) < m) {
                el.value = parseInt(el.value) + s;
            }
        } else {
            if (parseInt(el.value) > m) {
                el.value = parseInt(el.value) + s;
            }
        }
    }
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
    console.info("onConnect");
    for (const element of document.getElementsByClassName("mqtt-topic")) {
        client.subscribe(element.id)
    }
}

function onFailure(responseObject) {
    // Once a connection has failed
    console.info("onFailure");
    if (responseObject.errorCode !== 0) {
        console.error("onConnectionLost:" + responseObject.errorMessage);
    }
}

function sendMessage(topic, payload) {
    console.info("sendMessage");
    message = new Paho.MQTT.Message(payload);
    message.destinationName = topic;
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
