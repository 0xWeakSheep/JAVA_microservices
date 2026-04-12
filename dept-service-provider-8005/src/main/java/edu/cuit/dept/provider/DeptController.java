package edu.cuit.dept.provider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dept")
public class DeptController {

    @Value("${server.port}")
    private String port;

    @GetMapping("/info")
    public Map<String, String> getInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("service", "dept-service-provider");
        info.put("port", port);
        info.put("instance", "instance-8005");
        info.put("message", "这是来自端口 8005 的服务实例");
        return info;
    }

    @GetMapping("/list")
    public Map<String, Object> getList() {
        Map<String, Object> result = new HashMap<>();
        result.put("data", new String[]{"技术部", "市场部", "人事部", "财务部"});
        result.put("port", port);
        result.put("instance", "instance-8005");
        return result;
    }
}
