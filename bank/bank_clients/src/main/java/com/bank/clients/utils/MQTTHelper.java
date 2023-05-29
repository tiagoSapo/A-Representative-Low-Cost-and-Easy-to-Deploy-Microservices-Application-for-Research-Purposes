
package com.bank.clients.utils;

import com.bank.clients.controllers.AccountController;
import com.bank.clients.models.Message;
import com.bank.clients.services.AccountService;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import java.time.Instant;
import java.util.logging.Level;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class MQTTHelper {
    
    private static final Logger log = LoggerFactory.getLogger(AccountController.class);
    
    private final String brokerUrl;
    private final String clientId;
    private final String topic;
    
    private AccountController controller;
    
    private MqttClient client;

    public MQTTHelper(AccountController controller, String BROKER, String CLIENT_ID, String TOPIC) {
        this.controller = controller;
        this.brokerUrl = BROKER;
        this.clientId = CLIENT_ID;
        this.topic = TOPIC;
    }

    /**
     * This method makes the program ready to receive messages from MQTT
     */
    public void receiveMessages() {
        
        MemoryPersistence persistence = new MemoryPersistence();

        try {
            client = new MqttClient(brokerUrl, clientId, persistence);
            MqttConnectOptions connectOptions = new MqttConnectOptions();
            connectOptions.setCleanSession(true);

            log.info("[MQTT] Connecting to broker: " + brokerUrl);
            client.connect(connectOptions);
            log.info("[MQTT] Connected");

            log.info("[MQTT] Subscribing to topic: " + topic);
            client.subscribe(topic);

            client.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    // Handle connection lost
                    log.error("[|MQTT] Connection lost");
                }

                @Override
                public void messageArrived(String topic, MqttMessage message) throws Exception {
                    log.info("[|MQTT] Received message: " + new String(message.getPayload()));
                    controller.processMessage(message);
                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                    // Handle delivery complete
                }
            });
        } catch (MqttException e) {
            log.error("[|MQTT] Error: " + e.getMessage());
        }
    }
    
    public boolean sendMessage(Message msg) {
        
        // Check if MQTT is working or is connected
        if (client == null || !client.isConnected()) {
            log.warn("[MQTT] Problem sending message. MQTT is down!");
            return false;
        }
        
        
        // Check if message is valid
        if (msg == null) {
            log.warn("[MQTT] Problem sending message. MQTT message is invalid!");
            return false;
        }
        
        
        // Check if response topic of store is valid
        String storeTopic = msg.getConfirmationTopic();
        
        if (StringUtils.isEmpty(storeTopic)) {
            log.warn("[MQTT] Problem sending message. MQTT message is invalid!");
            return false;
        } 
        

        // Publish message to topic
        try {
            client.publish(storeTopic, Utils.toJson(msg));
            return true;
        } 
        catch (MqttException ex) {
            log.warn("[MQTT] Error send a message to topic \"" + storeTopic + "\": " + ex);
            return false;
        }
    }
}
