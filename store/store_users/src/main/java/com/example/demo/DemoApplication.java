package com.example.demo;

import com.example.demo.grpc.UserServer;
import java.io.IOException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) throws InterruptedException, IOException {
                UserServer.function();
		SpringApplication.run(DemoApplication.class, args);
	}

}
