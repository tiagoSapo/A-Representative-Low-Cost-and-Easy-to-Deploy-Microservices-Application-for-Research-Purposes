package com.example.demo.grpc.utils;


import org.eclipse.persistence.jpa.PersistenceProvider;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.spi.PersistenceUnitInfo;
import javax.persistence.spi.ProviderUtil;
import java.util.Map;

public class MyPersistenceProvider extends PersistenceProvider {

    @Override
    public EntityManagerFactory createEntityManagerFactory(String emName, Map properties) {
        throw new UnsupportedOperationException("Not supported in this example");
    }


    @Override
    public EntityManagerFactory createContainerEntityManagerFactory(PersistenceUnitInfo info, Map properties) {
        // Implement the creation of EntityManagerFactory using the provided PersistenceUnitInfo and properties
        return Persistence.createEntityManagerFactory(info.getPersistenceUnitName(), properties);
    }

    @Override
    public void generateSchema(PersistenceUnitInfo info, Map properties) {
        throw new UnsupportedOperationException("Not supported in this example");
    }

    @Override
    public boolean generateSchema(String persistenceUnitName, Map properties) {
        throw new UnsupportedOperationException("Not supported in this example");
    }

    @Override
    public ProviderUtil getProviderUtil() {
        throw new UnsupportedOperationException("Not supported in this example");
    }
}

