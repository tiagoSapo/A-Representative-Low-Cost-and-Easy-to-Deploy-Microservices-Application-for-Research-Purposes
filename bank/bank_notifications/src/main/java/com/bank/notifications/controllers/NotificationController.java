package com.bank.notifications.controllers;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class NotificationController {

    /**
     * Sends a notification to email of the new client (opened account)
     *
     * @param jsonMessage
     * @return
     */
    @PostMapping("create")
    public ResponseEntity createMessage(@RequestBody String jsonMessage) {

        String msg;
        Account accountDetails;

        try {
            accountDetails = new Gson()
                    .fromJson(jsonMessage, Account.class);

        } catch (JsonSyntaxException e) {
            return new ResponseEntity<>("Invalid account", HttpStatus.BAD_REQUEST);
        }

        msg = "You opened and account in the bank with the name = "
                + accountDetails.getHolderName();
        System.out.println("[Notification Service] " + msg);
        
        return send(msg, accountDetails.getHolderEmail());
    }

    /**
     * Sends a notification to email of the new client (updated account)
     *
     * @param jsonMessage
     * @return
     */
    @PostMapping("update")
    public ResponseEntity updateMessage(@RequestBody String jsonMessage) {

        String msg;
        Account accountDetails;

        try {
            accountDetails = new Gson()
                    .fromJson(jsonMessage, Account.class);

        } catch (JsonSyntaxException e) {
            return new ResponseEntity<>("Invalid account", HttpStatus.BAD_REQUEST);
        }

        msg = "Your account has been updated";
        System.out.println("[Notification Service] " + msg);
        
        return send(msg, accountDetails.getHolderEmail());
    }

    /**
     * Sends a notification to email of the new client (deleted account)
     *
     * @param jsonMessage
     * @return
     */
    @PostMapping("delete")
    public ResponseEntity deleteMessage(@RequestBody String jsonMessage) {

        String msg = "Your account has been deleted from the bank";
        Account accountDetails;
        try {
            accountDetails = new Gson()
                    .fromJson(jsonMessage, Account.class);

        } catch (JsonSyntaxException e) {
            return new ResponseEntity<>("Invalid account", HttpStatus.BAD_REQUEST);
        }

        System.out.println("[Notification Service] " + msg);
        return send(msg, accountDetails.getHolderEmail());
    }

    public ResponseEntity send(String msg, String email) {

        /* [Placeholder] Write the code to send a notification to the given email (SMTP) */
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
}
