
package com.bank.clients.exceptions;

public class AccountDoesntExistException extends Exception {

    public AccountDoesntExistException(String msg) {
        super(msg);
    }
    
}
