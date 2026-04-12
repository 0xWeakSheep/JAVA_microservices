package edu.cuit.dept.provider;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DeptProviderApplication8005 {
    public static void main(String[] args) {
        SpringApplication.run(DeptProviderApplication8005.class, args);
    }
}
