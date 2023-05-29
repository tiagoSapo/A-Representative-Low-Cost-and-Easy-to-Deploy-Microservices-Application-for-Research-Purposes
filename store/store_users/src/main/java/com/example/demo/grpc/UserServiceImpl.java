package com.example.demo.grpc;

import com.example.demo.grpc.models.CountryJpa;
import com.example.demo.grpc.models.FaqJpa;
import com.example.demo.grpc.models.UserJpa;
import com.example.demo.grpc.utils.MyPersistenceProvider;
import com.example.demo.grpc.utils.PersistenceUnitInfoImpl;
import com.example.demo.grpc.utils.Utils;
import com.proto.Auth;
import com.proto.Country;
import com.proto.Email;
import com.proto.Faq;
import com.proto.Id;
import com.proto.ListCountry;
import com.proto.ListFaq;
import com.proto.ListUser;
import com.proto.Ok;
import com.proto.User;
import com.proto.UserServiceGrpc;
import com.proto.Empty;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;

import io.grpc.stub.StreamObserver;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.persistence.jpa.PersistenceProvider;


public class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {
    
    // Logger to show information on the console
    private static final Logger log = LogManager.getLogger(UserServiceImpl.class);
    
    // Persistence unit name in JPA (check persistence.xml)
    private static final String PERSISTENCE_UNIT_NAME = "persistence-unit";
    
    // Alows contact with database
    private EntityManager em;
    
    
    // Constructor preparing the database 
    public UserServiceImpl() {
        HashMap<String, String> props = new HashMap<>();

        // Retrieve environment variables or use default values
        String jdbcUrl = System.getenv("DB_URL");
        String jdbcDbName = System.getenv("DB_NAME");
        String jdbcUser = System.getenv("DB_USER");
        String jdbcPassword = System.getenv("DB_PASSWORD");
        String jdbcDriver = System.getenv("DB_DRIVER");

        // Set default values if environment variables are not set
        if (jdbcUrl == null) {
            jdbcUrl = "jdbc:postgresql://localhost:5432/";
        } else {
            jdbcUrl = "jdbc:postgresql://" + jdbcUrl + "/";
        }

        if (jdbcDbName == null) {
            jdbcDbName = "testdb";
        }
        if (jdbcUser == null) {
            jdbcUser = "tiago";
        }
        if (jdbcPassword == null) {
            jdbcPassword = "4242";
        }
        if (jdbcDriver == null) {
            jdbcDriver = "org.postgresql.Driver";
        }
        System.out.println(jdbcUrl + jdbcDbName);
        log.info("esta: " + (jdbcUrl + jdbcDbName));

        // Set the properties
        props.put("javax.persistence.jdbc.url", jdbcUrl + jdbcDbName);
        props.put("javax.persistence.jdbc.user", jdbcUser);
        props.put("javax.persistence.jdbc.driver", jdbcDriver);
        props.put("javax.persistence.jdbc.password", jdbcPassword);
        props.put("javax.persistence.schema-generation.database.action", "create");

        // Add the entity classes to the persistence unit
        PersistenceUnitInfoImpl unitInfo = new PersistenceUnitInfoImpl();
        unitInfo.setPersistenceUnitName(PERSISTENCE_UNIT_NAME);
        unitInfo.addManagedClass(CountryJpa.class);
        unitInfo.addManagedClass(UserJpa.class);

        // Create an instance of your custom PersistenceProvider
        PersistenceProvider provider = new MyPersistenceProvider();

        // Create the EntityManagerFactory using the properties and PersistenceProvider
        EntityManagerFactory emf = provider.createContainerEntityManagerFactory(unitInfo, props);


        //EntityManagerFactory emf = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT_NAME, props);
        em = emf.createEntityManager();
    }



    /**
     * Shows exception messages on the console, and sends them to the client
     * @param errorMessage - error message to be shown
     * @param responseObserver -  GRPC observer (what will be returned by GRPC)
     */
    private void handleException(String errorMessage, StreamObserver<?> responseObserver) {

        var status = Status.INTERNAL.withDescription(errorMessage);
        var exception = new StatusRuntimeException(status.withDescription(errorMessage));

        responseObserver.onError(exception);

        log.warn(errorMessage);
    }

    
    // Methods overrides
    @Override
    public void getUsers(Empty request, StreamObserver<ListUser> responseObserver) {

        log.info("[UserServer] Method 'getUsers()' requested.");
        
        // list of users that will be sent as a response to C#
        var response = ListUser.newBuilder();

        // get users from DB
        List<UserJpa> users = em.createQuery("SELECT u FROM UserJpa u").getResultList();
                  
        // put users in response
        for (UserJpa user: users) {
            User u = User.newBuilder()
                .setId(user.getId())
                .setName(user.getName())
                .setEmail(user.getEmail())
                .setPassword(user.getPassword())
                .setPhone(user.getPhone())
                .setAddress(user.getAddress())
                .setCountry(user.getCountry().getId())
                .setCreatedAt(Utils.toProtoTimestamp(user.getCreatedAt()))
                .setUpdatedAt(Utils.toProtoTimestamp(user.getUpdatedAt()))
                .setCardNumber(user.getCardNumber())
                .build();
            
            response.addUser(u);
        }

        // send response back
        responseObserver.onNext(response.build());
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'getUsers()' sent.");

    }

    @Override
    public void getUserById(Id request, StreamObserver<User> responseObserver) {
        
        int id = request.getId();
        log.info("[UserServer] Method 'getUserById({0})' requested.", id);

        // get user with that id from DB
        UserJpa user = em.find(UserJpa.class, id);
        if (user == null) {
            handleException("[UserServer] There is no user with id: " + id, responseObserver);
            return;
        }      
                  
        // user that will be sent as a response to C#
        var response = User.newBuilder()
                .setId(user.getId())
                .setName(user.getName())
                .setEmail(user.getEmail())
                .setPassword(user.getPassword())
                .setPhone(user.getPhone())
                .setAddress(user.getAddress())
                .setCountry(user.getCountry().getId())
                .setCreatedAt(Utils.toProtoTimestamp(user.getCreatedAt()))
                .setUpdatedAt(Utils.toProtoTimestamp(user.getUpdatedAt()))
                .setCardNumber(user.getCardNumber())
                .build();

        // send response back
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'getUserById({0})' sent.", id);
    }
    
    @Override
    public void getUserByEmail(Email request, StreamObserver<User> responseObserver) {
        
        String email = request.getEmail();
        log.info("[UserServer] Method 'getUserByEmail({0})' requested.", email);

        // get user with that id from DB
        Query query = em.createQuery("SELECT u FROM UserJpa u WHERE u.email = :email");
        query.setParameter("email", email);
        UserJpa user;
        
        try {
            user = (UserJpa) query.getSingleResult();
        } 
        catch (Exception ex) {
            handleException("[UserServer] There is no user with email: " + email, responseObserver);
            return;
        }
                  
        // user that will be sent as a response to C#
        var response = User.newBuilder()
                .setId(user.getId())
                .setName(user.getName())
                .setEmail(user.getEmail())
                .setPassword(user.getPassword())
                .setPhone(user.getPhone())
                .setAddress(user.getAddress())
                .setCountry(user.getCountry().getId())
                .setCreatedAt(Utils.toProtoTimestamp(user.getCreatedAt()))
                .setUpdatedAt(Utils.toProtoTimestamp(user.getUpdatedAt()))
                .setCardNumber(user.getCardNumber())
                .build();

        // send response back
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'getUserByEmail({0})' sent.", email);
    }

    @Override
    public void addUser(User request, StreamObserver<Ok> responseObserver) {
        
        log.info("[UserServer] Method 'addUser()' requested.");
        UserJpa newUser = new UserJpa();
          
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword());
        newUser.setAddress(request.getAddress());
        newUser.setPhone(request.getPhone());
        newUser.setCreatedAt(Instant.now());
        newUser.setUpdatedAt(Instant.now());
        newUser.setCountry(em.find(CountryJpa.class, request.getCountry()));
        newUser.setCardNumber(request.getCardNumber());

        try {
            em.getTransaction().begin();
            em.persist(newUser);
            em.getTransaction().commit();
        } 
        catch (Exception ex) {
            handleException("[UserServer] Error trying to add user: " + ex, responseObserver);
            return;
        }
        
        Ok response = Ok.newBuilder().setOk(true).build();
        
        responseObserver.onNext(response);
        responseObserver.onCompleted();

        log.info("[UserServer] Response for 'addUser()' sent.");
    }
    
    @Override
    public void updateUser(User request, StreamObserver<Ok> responseObserver) {
        
        log.info("[UserServer] Method 'updateUser()' requested.");
        
        // Find the user with the given ID
        UserJpa user = em.find(UserJpa.class, request.getId());
        if (user == null) {
            handleException("[UserServer] Error trying to update user. There is no user with id " + request.getId(), responseObserver);
            return;
        }
        
        // Modify the user's properties
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setCountry(em.find(CountryJpa.class, request.getCountry()));
        user.setCardNumber(request.getCardNumber());
        
        try {
            em.getTransaction().begin();
            em.merge(user);
            em.getTransaction().commit();
        } 
        catch (Exception ex) {
            handleException("[UserServer] Error trying to update user: " + ex, responseObserver);
            return;
        }
        
        Ok response = Ok.newBuilder().setOk(true).build();
        
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'updateUser()' sent.");

    }

    @Override
    public void removeUser(Id request, StreamObserver<Ok> responseObserver) {
        
        log.info("[UserServer] Method removeUser()' requested.");
        int id = request.getId();
        
        try {
            UserJpa user = em.find(UserJpa.class, id);

            em.getTransaction().begin();
            em.remove(user);
            em.getTransaction().commit();
        } 
        catch (Exception ex) {
            handleException("[UserServer] Error trying to remove user: " + ex, responseObserver);
            return;
        }
        
        Ok response = Ok.newBuilder().setOk(true).build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'removeUser()' sent.");
    }

    @Override
    public void getCountries(Empty request, StreamObserver<ListCountry> responseObserver) {
        
        log.info("[UserServer] Method 'getCountries()' requested.");
        
        // list of users that will be sent as a response to C#
        var response = ListCountry.newBuilder();

        // get users from DB
        List<CountryJpa> countries = em.createQuery("SELECT c FROM CountryJpa c").getResultList();
                  
        // put users in response
        for (CountryJpa country: countries) {
            Country c = Country.newBuilder()
                .setId(country.getId())
                .setName(country.getName())
                .build();
            
            response.addCountry(c);
        }
    
        responseObserver.onNext(response.build());
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'getCountries()' sent.");
    }
    
    @Override
    public void getCountry(Id request, StreamObserver<Country> responseObserver) {
        
        int id = request.getId();
        log.info("[UserServer] Method 'getCountry({0})' requested.", id);

        // get country with that id from DB
        CountryJpa country = em.find(CountryJpa.class, id);
        if (country == null) {
            handleException("[UserServer] Error trying to remove user. There is no user with id = " + id, responseObserver);
            return;
        }
                  
        // country that will be sent as a response to C#
        var response = Country.newBuilder()
                .setName(country.getName())
                .setId(country.getId())
                .build();

        // send response back
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'getUserById({0})' sent.", id);
    }

    @Override
    public void addCountry(Country request, StreamObserver<Ok> responseObserver) {
        
        log.info("[UserServer] Method 'addCountry()' requested.");
        CountryJpa newCountry = new CountryJpa();
                 
        newCountry.setId(request.getId());
        newCountry.setName(request.getName());
        
        try {
            em.getTransaction().begin();
            em.persist(newCountry);
            em.getTransaction().commit();
        } 
        catch (Exception ex) {
            handleException("[UserServer] Error trying to add country: " + ex, responseObserver);
            return;
        }
        
        Ok response = Ok.newBuilder().setOk(true).build();
        
        responseObserver.onNext(response);
        responseObserver.onCompleted();

        log.info("[UserServer] Response for 'addCountry()' sent.");
    }

    @Override
    public void removeCountry(Id request, StreamObserver<Ok> responseObserver) {
        
        log.info("[UserServer] Method removeCountry()' requested.");
        int id = request.getId();
        
        CountryJpa country = em.find(CountryJpa.class, id);
        if (country == null) {
            var errorMessage = "[UserServer] Error trying to remove country. There is no country id = " + id;
            handleException(errorMessage, responseObserver);
            return;
        }
        
        em.getTransaction().begin();
        em.remove(country);
        em.getTransaction().commit();
        
        Ok response = Ok.newBuilder().setOk(true).build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'removeCountry()' sent.");
    }

    @Override
    public void getFaqs(Empty request, StreamObserver<ListFaq> responseObserver) {
        
        log.info("[UserServer] Method 'getFaqs()' requested.");
        
        // list of users that will be sent as a response to C#
        var response = ListFaq.newBuilder();

        // get users from DB
        List<FaqJpa> faqs = em.createQuery("SELECT f FROM FaqJpa f").getResultList();
                  
        // put users in response
        for (FaqJpa faq: faqs) {
            Faq f = Faq.newBuilder()
                .setId(faq.getId())
                .setQuestion(faq.getQuestion())
                .setAnwser(faq.getAnswer())
                .build();
            
            response.addFaq(f);
        }
    
        responseObserver.onNext(response.build());
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'getFaqs()' sent.");
    }
    
    @Override
    public void getFaq(Id request, StreamObserver<Faq> responseObserver) {
        
        int id = request.getId();
        log.info("[UserServer] Method 'getFaq({0})' requested.", id);

        // get country with that id from DB
        FaqJpa faq = em.find(FaqJpa.class, id);
        if (faq == null) {
            var errorMessage = "[UserServer] Error trying to get faq with id = " + id;
            handleException(errorMessage, responseObserver);
            return;
        }
                  
        // country that will be sent as a response to C#
        var response = Faq.newBuilder()
                .setId(faq.getId())
                .setQuestion(faq.getQuestion())
                .setAnwser(faq.getAnswer())
                .build();

        // send response back
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'getFaq({0})' sent.", id);
    }
    
    @Override
    public void addFaq(Faq request, StreamObserver<Ok> responseObserver) {
        
        log.info("[UserServer] Method 'addFaq()' requested.");
        FaqJpa newFaq = new FaqJpa();
                 
        newFaq.setId(request.getId());
        newFaq.setAnswer(request.getAnwser());
        newFaq.setQuestion(request.getQuestion());

        try {    
            em.getTransaction().begin();
            em.persist(newFaq);
            em.getTransaction().commit();  
        } 
        catch (Exception ex) {
            String errorMessage = "[UserServer] Error trying to add user: " + ex;
            handleException(errorMessage, responseObserver);
            return;
        }
        
        Ok response = Ok.newBuilder().setOk(true).build();
        
        responseObserver.onNext(response);
        responseObserver.onCompleted();

        log.info("[UserServer] Response for 'addFaq()' sent.");
    }

    @Override
    public void removeFaq(Id request, StreamObserver<Ok> responseObserver) {
        
        log.info("[UserServer] Method removeFaq()' requested.");
        int id = request.getId();
        
        FaqJpa faq = em.find(FaqJpa.class, id);
        if (faq == null) {
            var status = Status.INTERNAL.withDescription("[UserServer] Error trying to remove faq");
            responseObserver.onError(status.asRuntimeException());
            return;
        }
        
        em.getTransaction().begin();
        em.remove(faq);
        em.getTransaction().commit();
        
        Ok response = Ok.newBuilder().setOk(true).build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        
        log.info("[UserServer] Response for 'removeFaq()' sent.");
    }

    @Override
    public void authenticate(Auth request, StreamObserver<Ok> responseObserver) {
        
        log.info("[UserServer] Method authenticate()' requested.");
        
        String email = request.getEmail();
        String password = request.getPassword();
        
        if (StringUtils.isEmpty(email) || StringUtils.isEmpty(password)) {
            var status = Status.INTERNAL.withDescription("[UserServer] Invalid authentication");
            responseObserver.onError(status.asRuntimeException());
            return;
        }
        
        Query query = em.createQuery("SELECT u FROM UserJpa u WHERE u.email = :email");
        query.setParameter("email", email);
        UserJpa user;
        Ok response;
        
        try {
            user = (UserJpa) query.getSingleResult();
            if (!user.getPassword().equals(password)) {
                response = Ok.newBuilder().setOk(false).build();
                responseObserver.onNext(response);
                responseObserver.onCompleted();
                return;
            }
            response = Ok.newBuilder().setOk(true).build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } 
        catch (Exception ex) {
            response = Ok.newBuilder().setOk(false).build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
        
        log.info("[UserServer] Response for 'authenticate()' sent.");
    }

    @Override
    public void register(User request, StreamObserver<Ok> responseObserver) {
        
        log.info("[UserServer] Method 'register()' requested.");
        UserJpa newUser = new UserJpa();
                 
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword());
        newUser.setAddress(request.getAddress());
        newUser.setPhone(request.getPhone());
        newUser.setCreatedAt(Instant.now());
        newUser.setUpdatedAt(Instant.now());
        newUser.setCardNumber(request.getCardNumber());
        newUser.setCountry(em.find(CountryJpa.class, request.getCountry()));

        try {
            em.getTransaction().begin();
            em.persist(newUser);
            em.getTransaction().commit();
        } 
        catch (Exception ex) {
            
            String errorMessage = "[UserServer] Error trying to add user " + ex.getMessage();
            handleException(errorMessage, responseObserver);
            return;
        }
        
        
        Ok response = Ok.newBuilder().setOk(true).build();
        
        responseObserver.onNext(response);
        responseObserver.onCompleted();

        log.info("[UserServer] Response for 'register()' sent.");
    }
      
    
}
