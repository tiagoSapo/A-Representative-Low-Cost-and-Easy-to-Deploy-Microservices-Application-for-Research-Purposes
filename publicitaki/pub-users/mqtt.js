const mqtt = require('mqtt');
const { createOrUpdateSubscriptionForStoreById } = require('./services/subscriptionService');

// TOPICS (store subscription's payment)
const TOPIC_WRITE = "tiago-bank/transactions"; /* Topic to pay store's subscription */
const TOPIC_READ = `Publicitaki-${Date.now()}-${Math.floor(Math.random() * 1000000)}`; /* Topic to receive the confirmation from the bank */

const client = mqtt.connect('tcp://broker.hivemq.com:1883');

client.on('connect', function () {
    console.log('Connected to MQTT broker');
    client.subscribe(TOPIC_READ);
});

client.on('message', function (topic, message) {
    handleMessage(message);
});

function handleMessage(message) {

    // NOTE: orderId = StoreId (because of store system)

    const json = JSON.parse(message);
    if (!json.orderId) {
        console.warn("Invalid MQTT message");
    }

    // create a new Date object for the current moment
    const currentDate = new Date();

    // add 1 month to the current date
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(currentDate.getMonth() + 1);

    try {
        createOrUpdateSubscriptionForStoreById(oneMonthLater.toString(), 'true', json.orderId);
        console.log("Subscription activated for store = " + json.orderId);
    } catch (err) {
        console.error("Error updating subscription");
    }
}




module.exports = {
    client,
    TOPIC_WRITE,
    TOPIC_READ
}
