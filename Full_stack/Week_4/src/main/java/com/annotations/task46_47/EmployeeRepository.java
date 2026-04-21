package com.annotations.task46_47;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class EmployeeRepository {
    private List<Employee> employees = new ArrayList<>();

    public EmployeeRepository() {
        employees.add(new Employee(101, "Alice", "Software Engineer", 75000));
        employees.add(new Employee(102, "Bob", "Project Manager", 95000));
        employees.add(new Employee(103, "Charlie", "QA Analyst", 60000));
    }

    public List<Employee> getAllEmployees() {
        return employees;
    }

    public void addEmployee(Employee emp) {
        emp.setId(employees.size() + 101);
        employees.add(emp);
    }
}
