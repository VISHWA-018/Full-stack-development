package com.annotations.task46_47;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/employees")
public class EmployeeMvcController {

    // Task 4.6: Demonstrate BeanFactory usage
    @Autowired
    private BeanFactory beanFactory;

    // Task 4.7: Basic Spring MVC mapping
    @GetMapping
    public String viewEmployees(Model model) {
        // fetching bean programmatically utilizing BeanFactory
        EmployeeRepository employeeRepo = beanFactory.getBean(EmployeeRepository.class);
        
        model.addAttribute("employees", employeeRepo.getAllEmployees());
        return "employees/list";
    }
}
