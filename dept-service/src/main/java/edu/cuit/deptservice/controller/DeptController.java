package edu.cuit.deptservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * 部门服务控制器
 */
@RestController
@RequestMapping("/dept")
public class DeptController {

    private static final Logger logger = LoggerFactory.getLogger(DeptController.class);

    @Value("${server.port}")
    private String serverPort;

    @Value("${spring.application.name}")
    private String serviceName;

    // 模拟部门数据
    private static final List<Map<String, Object>> DEPT_LIST = new ArrayList<>();

    static {
        Map<String, Object> dept1 = new HashMap<>();
        dept1.put("deptNo", 10);
        dept1.put("dname", "ACCOUNTING");
        dept1.put("loc", "NEW YORK");

        Map<String, Object> dept2 = new HashMap<>();
        dept2.put("deptNo", 20);
        dept2.put("dname", "RESEARCH");
        dept2.put("loc", "DALLAS");

        Map<String, Object> dept3 = new HashMap<>();
        dept3.put("deptNo", 30);
        dept3.put("dname", "SALES");
        dept3.put("loc", "CHICAGO");

        Map<String, Object> dept4 = new HashMap<>();
        dept4.put("deptNo", 40);
        dept4.put("dname", "OPERATIONS");
        dept4.put("loc", "BOSTON");

        DEPT_LIST.add(dept1);
        DEPT_LIST.add(dept2);
        DEPT_LIST.add(dept3);
        DEPT_LIST.add(dept4);
    }

    /**
     * 获取所有部门列表
     */
    @GetMapping("/list")
    public Map<String, Object> list(HttpServletRequest request) {
        logger.info("收到请求: /dept/list");
        logger.info("请求头 X-Request-Id: {}", request.getHeader("X-Request-Id"));
        logger.info("请求头 Authorization: {}", request.getHeader("Authorization"));

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", DEPT_LIST);
        result.put("service", serviceName);
        result.put("port", serverPort);
        return result;
    }

    /**
     * 根据部门编号获取部门信息
     */
    @GetMapping("/get/{deptNo}")
    public Map<String, Object> get(@PathVariable("deptNo") Integer deptNo, HttpServletRequest request) {
        logger.info("收到请求: /dept/get/{}", deptNo);

        Map<String, Object> result = new HashMap<>();

        for (Map<String, Object> dept : DEPT_LIST) {
            if (dept.get("deptNo").equals(deptNo)) {
                result.put("code", 200);
                result.put("message", "success");
                result.put("data", dept);
                result.put("service", serviceName);
                result.put("port", serverPort);
                return result;
            }
        }

        result.put("code", 404);
        result.put("message", "Department not found");
        result.put("data", null);
        return result;
    }

    /**
     * 添加部门
     */
    @PostMapping("/add")
    public Map<String, Object> add(@RequestBody Map<String, Object> dept, HttpServletRequest request) {
        logger.info("收到请求: /dept/add, 数据: {}", dept);

        DEPT_LIST.add(dept);

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "Department added successfully");
        result.put("data", dept);
        result.put("service", serviceName);
        result.put("port", serverPort);
        return result;
    }

    /**
     * 健康检查接口
     */
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "UP");
        result.put("service", serviceName);
        result.put("port", serverPort);
        return result;
    }
}
