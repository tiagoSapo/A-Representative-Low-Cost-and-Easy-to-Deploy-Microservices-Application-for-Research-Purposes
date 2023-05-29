
package com.bank.clients.services;


import com.bank.clients.exceptions.AccountDoesntExistException;
import com.bank.clients.exceptions.InvalidAccountException;
import com.bank.clients.models.Account;
import com.bank.clients.repositories.AccountRepository;
import com.bank.clients.exceptions.AccountExistsException;
import com.bank.clients.exceptions.JpaAccountException;
import com.bank.clients.utils.RestHandler;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepository bankAccountRepository;
    
    public RestHandler restHandler;
    
    private final static Logger LOGGER = 
                Logger.getLogger(Logger.GLOBAL_LOGGER_NAME);
    
    public AccountService() {
        this.restHandler = new RestHandler();
    }

    public Account add(Account account) throws 
            AccountExistsException, 
            InvalidAccountException, 
            JpaAccountException { 
        
        /* check if an account with that name exists */
        boolean accountExists = bankAccountRepository
                .existsByHolderName(account.getHolderName());
        LOGGER.log(Level.INFO, "-> {0}", accountExists);
        
        if (accountExists)
            throw new AccountExistsException("The account " 
                    + account.getHolderName() + " already exists");
        
        if (!account.isValid())
            throw new InvalidAccountException("The account is not valid");
        
        account = bankAccountRepository.save(account);
        if (account == null)
            throw new JpaAccountException("Problem saving account on method 'add'");
        
        /* send notification to email */
        restHandler.sendCreate(account); 
        
        return account;
    }

    public List<Account> getAll() {
        return bankAccountRepository.findAll();
    }

    public Account getById(Long id) throws AccountDoesntExistException {
        
        Account account = bankAccountRepository
                .findById(id)
                .orElse(null);
        
        if (account == null) 
            throw new AccountDoesntExistException("The account " + id + " doesnt exist");
        
        return account;
    }

    public Account update(Account newAccount) throws 
            AccountDoesntExistException, 
            InvalidAccountException, 
            JpaAccountException {
        
        long id = newAccount.getId();
        Account oldAccount = this.getById(id);
        
        /* replace existing entity */
        oldAccount.copyFrom(newAccount);
 
        Account account = bankAccountRepository.save(oldAccount);
        if (account == null) {
            throw new JpaAccountException("The account " + id + " doesnt exist");
        }
        
        restHandler.sendUpdate(account);
        return account;
    }

    public void delete(Long id) throws AccountDoesntExistException {
        
        Account account = this.getById(id);
        bankAccountRepository.deleteById(id);
        
        restHandler.sendDelete(account);
    }

    public Account deposit(Long id, double amount) throws AccountDoesntExistException {
        
        LOGGER.log(Level.INFO, "ID = {0}", id);
        LOGGER.log(Level.INFO, "AMOUNT = {0}", amount);
        
        Account account = this.getById(id);
        
        /* removes money */
        account.deposit(amount);
        
        /* saves the account */
        bankAccountRepository.save(account);
        
        return account;
    }
    
    public Account withdraw(Long id, double amount) throws AccountDoesntExistException {
        
        LOGGER.log(Level.INFO, "ID = {0}", id);
        LOGGER.log(Level.INFO, "AMOUNT = {0}", amount);
        
        Account account = this.getById(id);
        
        /* removes money */
        account.withdraw(amount);
        
        /* saves the account */
        bankAccountRepository.save(account);
        
        return account;
    }
}
