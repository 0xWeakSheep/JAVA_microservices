package edu.cuit.moviesgateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@EnableZuulProxy
@ComponentScan(basePackages = "edu.cuit")
public class MoviesGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(MoviesGatewayApplication.class, args);
    }
}
