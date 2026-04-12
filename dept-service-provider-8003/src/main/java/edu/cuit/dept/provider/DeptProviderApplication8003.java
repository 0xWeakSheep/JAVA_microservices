package edu.cuit.dept.provider;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DeptProviderApplication8003 {
    public static void main(String[] args) {
        SpringApplication.run(DeptProviderApplication8003.class, args);
    }
}
