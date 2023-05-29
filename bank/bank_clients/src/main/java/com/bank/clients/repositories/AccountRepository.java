
package com.bank.clients.repositories;

import com.bank.clients.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>{
    public boolean existsByHolderName(String holderName);
}
