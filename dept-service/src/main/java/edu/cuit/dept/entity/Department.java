package edu.cuit.dept.entity;

public class Department {
    private Long id;
    private String name;
    private String location;
    private Integer employeeCount;

    public Department() {}

    public Department(Long id, String name, String location, Integer employeeCount) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.employeeCount = employeeCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Integer employeeCount) {
        this.employeeCount = employeeCount;
    }
}
