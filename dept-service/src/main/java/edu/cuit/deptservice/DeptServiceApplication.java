package edu.cuit.deptservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DeptServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeptServiceApplication.class, args);
    }
}
