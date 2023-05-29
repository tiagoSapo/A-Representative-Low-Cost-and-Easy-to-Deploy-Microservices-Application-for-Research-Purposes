package com.bank.clients.controllers;

import com.bank.clients.utils.MQTTHelper;
import com.bank.clients.exceptions.AccountDoesntExistException;
import com.bank.clients.exceptions.AccountExistsException;
import com.bank.clients.exceptions.InvalidAccountException;
import com.bank.clients.exceptions.JpaAccountException;
import com.bank.clients.services.AccountService;
import com.bank.clients.models.Account;
import com.bank.clients.models.Message;
import com.bank.clients.utils.MQTTHelper;
import com.bank.clients.utils.Utils;
import com.google.gson.JsonSyntaxException;
import java.util.List;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    public AccountService bankAccountService;

    /* Usar site "http://www.hivemq.com/demos/websocket-client/" para testar */
    /* usar: "broker.hivemq.com" + porto 8000 */
    private final MQTTHelper mqtt;
    public static final String BROKER = "tcp://broker.hivemq.com:1883";
    public static final String CLIENT_ID = UUID.randomUUID().toString();
    public static final String TOPIC = "tiago-bank/transactions";

    private static final Logger log = LoggerFactory.getLogger(AccountController.class);

    public AccountController() {
        mqtt = new MQTTHelper(this, BROKER, CLIENT_ID, TOPIC);
        mqtt.receiveMessages();
    }

    /**
     * Get all bank accounts
     *
     * @return
     */
    @GetMapping
    public ResponseEntity index() {
        List<Account> accounts = bankAccountService.getAll();
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    /**
     * Get a specific bank account by its id
     *
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity index(@PathVariable Long id) {

        Account account;

        try {
            account = bankAccountService.getById(id);

        } catch (AccountDoesntExistException ex) {
            log.warn(ex.getMessage());
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(account, HttpStatus.OK);
    }

    /**
     * Open an account on the bank
     *
     * @param account
     * @return
     */
    @PostMapping
    public ResponseEntity create(@RequestBody Account account) {

        String msg;

        try {
            account = bankAccountService.add(account);
            /* open a new account */
        } catch (AccountExistsException | InvalidAccountException | JpaAccountException ex) {
            log.warn(ex.getMessage());
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

        msg = "A new account \"" + account.getHolderName() + "\" was opened on the bank";
        return new ResponseEntity<>(msg, HttpStatus.CREATED);
    }

    /**
     * Updates an account's holderName
     *
     * @param account
     * @return
     */
    @PutMapping
    public ResponseEntity update(@RequestBody Account account) {

        String msg;

        try {
            account = bankAccountService.update(account);
        } catch (AccountDoesntExistException | InvalidAccountException | JpaAccountException ex) {
            log.warn(ex.getMessage());
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

        msg = "The account \"" + account.getHolderName() + "\" was updated";
        return new ResponseEntity<>(msg, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable Long id) {

        String msg;

        try {
            bankAccountService.delete(id);
        } catch (AccountDoesntExistException ex) {
            log.warn(ex.getMessage());
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

        msg = "Account deleted sucessfully";
        return new ResponseEntity<>(msg, HttpStatus.ACCEPTED);
    }

    /**
     * Adds funds to existing account
     *
     * @param id
     * @param amount
     * @return
     */
    @PostMapping("/{id}/deposit")
    public ResponseEntity deposit(@PathVariable Long id, @RequestBody double amount) {

        String msg;

        try {
            bankAccountService.deposit(id, amount);
        } catch (AccountDoesntExistException ex) {
            log.warn(ex.getMessage());
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

        msg = "Deposited \"" + amount + "\" dollars into the account " + id;
        return new ResponseEntity<>(msg, HttpStatus.ACCEPTED);
    }

    /**
     * Removes funds to existing account
     *
     * @param id
     * @param amount
     * @return
     */
    @PostMapping("/{id}/withdraw")
    public ResponseEntity withdraw(@PathVariable Long id, @RequestBody double amount) {

        String msg;

        try {
            bankAccountService.withdraw(id, amount);
        } 
        catch (AccountDoesntExistException ex) {
            log.warn(ex.getMessage());
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }

        msg = "Withdrawed \"" + amount + "\" dollars into the account " + id;
        return new ResponseEntity<>(msg, HttpStatus.ACCEPTED);
    }

    public void processMessage(MqttMessage mqttMessage) {

        Message msg;
        long sender, receiver;
        double amount;

        try {
            
            // FETCHING information from MQTT message
            msg = Utils.fromJson(mqttMessage);          
            log.info("[MQTT] Handleling message: " + msg);
            
            sender = msg.getIbanSender();
            receiver = msg.getIbanReceiver();
            amount = msg.getAmount();
            
            
            // WITHDRAWING amount from sender's account
            // (if sender's (id < 0) there is no receiver, so ignore (anonymous sender))
            if (receiver >= 0) {
                log.info("[MQTT] Depositing " + amount
                    + " dollars into account " + receiver);
                bankAccountService.deposit(receiver, amount);
            }
            
            
            // DEPOSITING amount into receiver's account
            // (if sender's (id < 0) there is no sender, so ignore (anonymous sender))
            if (sender >= 0) {
                
                log.info("[MQTT] Withdrawing " + amount
                        + " dollars from account " + sender);
                bankAccountService.withdraw(sender, amount);
                
                // SENDING confirmation back to the store via MQTT
                boolean confirmationOk = sendConfirmation(msg);
                if (confirmationOk) {
                    log.info("[MQTT] Sent success notification to topic: " 
                            + msg.getConfirmationTopic());
                }
            }
            
        } 
        catch (AccountDoesntExistException ex) {
            log.warn("[MQTT] Sender or Receiver don't exist on the system: " + ex);
        } 
        catch (JsonSyntaxException ex) {
            log.warn("[MQTT] Received an invalid message. Ignoring it.");
        }

    }

    private boolean sendConfirmation(Message msg) {
        return mqtt.sendMessage(msg);
    }
}
