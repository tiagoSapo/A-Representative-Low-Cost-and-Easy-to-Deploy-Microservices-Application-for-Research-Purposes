import logging
import uuid
import paho.mqtt.client as mqtt
from enum import Enum

import time
import uuid

import json


'''
--------------- HOST and PORT ---------------
'''
# Host
MQTT_HOST = "broker.hivemq.com"

# Port
MQTT_PORT = 1883

# Client id
MQTT_CLIENT_ID = str(uuid.uuid4())


'''
--------------- TOPICS ---------------
'''
# Get the read topic for the store
# Get the current timestamp in milliseconds
timestamp_ms = int(round(time.time() * 1000))
# Generate a random UUID
uid = str(uuid.uuid4())
# Create the topic name with the timestamp and UID appended
TOPIC_READ = "store-products/complete-payments-{}-{}".format(timestamp_ms, uid)


# Bank topic to send the payment request
TOPIC_WRITE = "tiago-bank/transactions"





'''
--------------- LOGIC ---------------
'''
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(TOPIC_READ)

def on_message(client, userdata, msg):
    # Handle the received message here
    payload = json.loads(msg.payload.decode('utf-8'))
    message = Message(**payload)
    
    from products_app.views import mark_as_payment_received
    logging.info(msg.topic + " " + str(msg.payload)+ "\n")
    mark_as_payment_received(None, message.orderId)


class Message:
    def __init__(self, ibanSender, ibanReceiver, amount, date, orderId, confirmationTopic):
        self.ibanSender = ibanSender
        self.ibanReceiver = ibanReceiver
        self.amount = amount
        self.date = date
        self.orderId = orderId
        self.confirmationTopic = confirmationTopic

    def __str__(self):
        return f"{self.ibanSender} {self.ibanReceiver} {self.amount} {self.date} {self.orderId} {self.confirmationTopic}"


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(MQTT_HOST, MQTT_PORT, 60)


