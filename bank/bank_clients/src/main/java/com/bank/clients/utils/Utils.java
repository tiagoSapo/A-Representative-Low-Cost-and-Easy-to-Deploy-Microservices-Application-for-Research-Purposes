package com.bank.clients.utils;

import com.bank.clients.models.Message;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import java.nio.charset.StandardCharsets;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Utils {

    /**
     * Returns a Message object from a JSON String received by MQTT
     * @param message - MQTT message received
     * @return 
     */
    public static Message fromJson(MqttMessage message) throws JsonSyntaxException {

        Gson gson = new Gson();
        String messageString = new String(message.getPayload(), StandardCharsets.UTF_8);
        
        System.out.println(messageString);
        
        return gson.fromJson(messageString, Message.class);
    }

    /**
     * Returns a Message object from a JSON String received by MQTT
     * @param message - MQTT message received
     * @return 
     */
    public static MqttMessage toJson(Message message) throws JsonSyntaxException {

        Gson gson = new Gson();
        String json = gson.toJson(message);
        
        return new MqttMessage(json.getBytes());
    }
}
