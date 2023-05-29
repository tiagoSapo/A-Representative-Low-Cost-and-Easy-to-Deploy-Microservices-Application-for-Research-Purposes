const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');


// TOPICS (store subscription's payment)
const TOPIC_WRITE = "tiago-bank/transactions"; /* Topic to pay store's subscription */
const TOPIC_READ = `Publicitaki-${Date.now()}-${Math.floor(Math.random() * 1000000)}`; /* Topic to receive the confirmation from the bank */


const app = express();
const bodyParser = require('body-parser');


// Route files
const storeRoutes = require('./routes/storeRoutes');
const customerRoutes = require('./routes/customerRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

// Server parameters
const PORT = process.env.PORT || 3000;

// Parsers
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Routes
app.use('/', storeRoutes);
app.use('/', customerRoutes);
app.use('/', subscriptionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


// MQTT
/*
const client = mqtt.connect('tcp://broker.hivemq.com:1883');

client.on('connect', function () {
  console.log('Connected to MQTT broker');
  client.subscribe(TOPIC_READ);
});

client.on('message', function (topic, message) {
  console.log('Received message:', message.toString());
});

module.exports = {
  client,
  TOPIC_WRITE,
  TOPIC_READ
}*/