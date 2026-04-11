package edu.cuit.dept.controller;

import edu.cuit.dept.entity.Department;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/dept")
public class DeptController {

    @GetMapping("/list")
    public List<Department> list() {
        return Arrays.asList(
            new Department(1L, "技术部", "3楼A区", 25),
            new Department(2L, "市场部", "2楼B区", 15),
            new Department(3L, "人事部", "1楼C区", 8),
            new Department(4L, "财务部", "4楼D区", 10)
        );
    }

    @GetMapping("/get/{id}")
    public Department get(@PathVariable Long id) {
        return new Department(id, "技术部", "3楼A区", 25);
    }

    @PostMapping("/add")
    public String add(@RequestBody Department dept) {
        return "部门添加成功: " + dept.getName();
    }

    @GetMapping("/hello")
    public String hello(@RequestParam(required = false) String name) {
        return "Hello from Dept Service! " + (name != null ? "Name: " + name : "");
    }
}
