
package com.bank.clients.utils;

import com.bank.clients.models.Account;
import com.google.gson.Gson;
import com.mysql.cj.log.Log;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

public class RestHandler {
    
    private RestTemplate restTemplate = new RestTemplate();
    
    /** links to Notification Service **/
    private static final String IP = "bank-notifications";
    private static final String PORT = "8080";
    private static final String URL = "http://" + IP + ":" + PORT + "/";
    private static final String CREATE_URL = "create";
    private static final String UPDATE_URL = "update";
    private static final String DELETE_URL = "delete";
    
    /**
     * Sends HTTP POST to notify client about operation on his account
     * @param message
     * @param url
     * @return 
     */
    private ResponseEntity sendToNotificationService(String message, String httpMethod) {
        
        try {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(message, headers);
        String response = restTemplate.postForObject(URL + httpMethod, request, String.class);
        } catch (RestClientException ex) {
            System.out.println("Problem sending message to Notification Service: " + ex.getMessage());
        }
        
        return new ResponseEntity<>("", HttpStatus.OK);
    }
    
    /**
     * Sends update notification to the notifications micro-service
     * @param account - the account that was updated
     * @return - tells whether or not the notification was sent
     */
    public boolean sendUpdate(Account account) {
        ResponseEntity<String> result = sendToNotificationService(new Gson().toJson(account), UPDATE_URL);
        System.out.println("[Info] Notification service said: " + result);
        return result.getStatusCode().is2xxSuccessful();
    }
    
    /**
     * Sends delete notification to the notifications micro-service
     * @param account - the account that was deleted
     * @return - tells whether or not the notification was sent
     */
    public boolean sendDelete(Account account) {
        ResponseEntity<String> result = sendToNotificationService(new Gson().toJson(account), DELETE_URL);
        System.out.println("[Info] Notification service said: " + result);
        return result.getStatusCode().is2xxSuccessful();
    }
    
    /**
     * Sends create notification to the notifications micro-service
     * @param account - the account that was created
     * @return - tells whether or not the notification was sent
     */
    public boolean sendCreate(Account account) {
        
        ResponseEntity<String> result = sendToNotificationService(new Gson().toJson(account), CREATE_URL);
        System.out.println("[Info] Notification service said: " + result);
        return result.getStatusCode().is2xxSuccessful();
    }
}
