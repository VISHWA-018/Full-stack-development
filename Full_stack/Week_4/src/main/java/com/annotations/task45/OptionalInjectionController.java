package com.annotations.task45;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/task45")
public class OptionalInjectionController {

    // required = false means Spring won't throw an error if OptionalService is missing
    @Autowired(required = false)
    private OptionalService optionalService;

    @GetMapping
    public String checkOptional() {
        if (optionalService != null) {
            return optionalService.getInfo();
        } else {
            return "Task 4.5: OptionalService bean is missing, but gracefully handled !";
        }
    }
}
