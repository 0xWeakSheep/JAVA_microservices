package edu.cuit.yingpingsxitong.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 配置中心演示控制器
 * 用于演示从 Config Server 获取配置以及动态刷新功能
 */
@RestController
@RequestMapping("/api/config")
@RefreshScope
public class ConfigDemoController {

    @Value("${app.name:默认名称}")
    private String appName;

    @Value("${app.version:1.0.0}")
    private String appVersion;

    @Value("${app.description:暂无描述}")
    private String appDescription;

    @Value("${app.author:未知}")
    private String appAuthor;

    @Value("${server.port:3001}")
    private String serverPort;

    /**
     * 获取当前应用配置信息
     */
    @GetMapping("/info")
    public Map<String, Object> getConfigInfo() {
        Map<String, Object> config = new HashMap<>();
        config.put("appName", appName);
        config.put("appVersion", appVersion);
        config.put("appDescription", appDescription);
        config.put("appAuthor", appAuthor);
        config.put("serverPort", serverPort);
        config.put("source", "Config Server");
        return config;
    }

    /**
     * 健康检查端点
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", appName);
        return health;
    }
}
