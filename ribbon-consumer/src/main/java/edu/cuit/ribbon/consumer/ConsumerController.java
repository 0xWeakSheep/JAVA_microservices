package edu.cuit.ribbon.consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/consumer")
public class ConsumerController {

    @Autowired
    private RestTemplate restTemplate;

    private static final String SERVICE_URL = "http://dept-service-provider";

    /**
     * 调用一次服务
     */
    @GetMapping("/call")
    public Map callService() {
        return restTemplate.getForObject(SERVICE_URL + "/dept/info", Map.class);
    }

    /**
     * 连续调用10次服务，验证负载均衡
     */
    @GetMapping("/test")
    public Map testLoadBalance() {
        List<Map> results = new ArrayList<>();
        
        for (int i = 0; i < 10; i++) {
            Map result = restTemplate.getForObject(SERVICE_URL + "/dept/info", Map.class);
            results.add(result);
        }

        Map response = new HashMap();
        response.put("totalCalls", 10);
        response.put("results", results);
        response.put("strategy", "RoundRobinRule (轮询)");
        
        return response;
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public String health() {
        return "Ribbon Consumer is running!";
    }
}
