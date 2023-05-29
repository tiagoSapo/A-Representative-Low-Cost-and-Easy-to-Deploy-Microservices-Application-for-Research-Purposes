
package com.example.demo.grpc;


import io.grpc.Server;
import io.grpc.ServerBuilder;
import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


public class UserServer {
    
    private static final Logger log = LogManager.getLogger(UserServer.class);
    private static final int PORT = 6000; /* GRPC PORT*/
    
    public static void function() throws InterruptedException, IOException {
        
        log.info("[UserServer] Starting gRPC server...");
        
        Server server = ServerBuilder.forPort(PORT)
                .addService(new UserServiceImpl())
                .build()
                .start();
        
        log.info("[UserServer] Server is listening (localhost:" + PORT + ")!");

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            log.info("[UserSever] Server is shutting down...");
            server.shutdown();
            log.info("[UserServer] Server is turned off");
        }));
        server.awaitTermination();
    }
}
