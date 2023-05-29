package com.bank.clients.models;


import com.bank.clients.exceptions.InvalidAccountException;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import org.springframework.util.StringUtils;

@Entity
@Table(name = "account")
public class Account implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "balance")
    private double balance;

    @Column(name = "holder_name")
    private String holderName;
    
    @Column(name = "holder_email")
    private String holderEmail;

    public Account() {
    }

    public Account(double balance, String holderName, String holderEmail) {
        assignProperties(balance, holderName, holderEmail);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public double getBalance() {
        return balance;
    }

    public String getHolderEmail() {
        return holderEmail;
    }

    public void setHolderEmail(String holderEmail) {
        this.holderEmail = holderEmail;
    }

    @Override
    public String toString() {
        return "Account{" + "id=" + id + ", balance=" + balance + ", holderName=" + holderName + ", holderEmail=" + holderEmail + '}';
    }

    /*
        Aux methods
    */
    private void assignProperties(double balance, String holderName, String holderEmail) {
        this.balance = balance;
        this.holderName = holderName;
        this.holderEmail = holderEmail;
    }
    
    public boolean isValid() {
        return (!StringUtils.isEmpty(this.holderName) && !StringUtils.isEmpty(this.holderEmail));
    }
    
    public void copyFrom(Account bankAccount) throws InvalidAccountException {
        
        if (!bankAccount.isValid()) {
            throw new InvalidAccountException("The account given is not valid");
        }
        
        this.assignProperties(
                bankAccount.balance, 
                bankAccount.holderName, 
                bankAccount.holderEmail
        );
    }
    
    public void deposit(double amount) {
        balance += amount;
    }

    public void withdraw(double amount) {
        balance -= amount;
    }
}
