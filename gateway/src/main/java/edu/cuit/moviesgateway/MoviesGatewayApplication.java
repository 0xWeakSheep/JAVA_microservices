package edu.cuit.moviesgateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MoviesGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(MoviesGatewayApplication.class, args);
    }
}
