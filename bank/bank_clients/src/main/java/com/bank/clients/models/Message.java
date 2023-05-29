
package com.bank.clients.models;

import com.google.gson.annotations.SerializedName;
import java.io.Serializable;
import java.time.Instant;


public class Message implements Serializable {

    private long ibanSender; /* sender's id (who will be paying) */
    private long ibanReceiver; /* receiver's id (who will receive the money) [if negative => there is no sender]*/
    private double amount; /* sum of money */
    private String date; /* date of the transaction */
    
    /* Optinal fields */
    private Integer orderId; /* store's order id [OPTINAL!]*/ 
    private String confirmationTopic; /* store's confirmation topic [OPTINAL!]*/ 

    public Message() {}

    public Message(long ibanSender, long ibanReceiver, double amount, String date, Integer orderId, String confirmationTopic) {
        this.ibanSender = ibanSender;
        this.ibanReceiver = ibanReceiver;
        this.amount = amount;
        this.date = date;
        this.orderId = orderId;
        this.confirmationTopic = confirmationTopic;
    }

    public long getIbanSender() {
        return ibanSender;
    }

    public void setIbanSender(Long ibanSender) {
        this.ibanSender = ibanSender;
    }

    public long getIbanReceiver() {
        return ibanReceiver;
    }

    public void setIbanReceiver(long ibanReceiver) {
        this.ibanReceiver = ibanReceiver;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getConfirmationTopic() {
        return confirmationTopic;
    }

    public void setConfirmationTopic(String confirmationTopic) {
        this.confirmationTopic = confirmationTopic;
    }
        

    @Override
    public String toString() {
        return "Message{" 
                + "ibanSender=" + ibanSender 
                + ", ibanReceiver=" + ibanReceiver 
                + ", amount=" + amount 
                + ", date=" + date  
                + ", orderId=" + orderId 
                + ", topic=" + confirmationTopic 
                + '}';
    }
}
