package com.annotations.task42;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/task42")
public class FieldInjectionController {

    // Field Injection
    @Autowired
    private GreetingService greetingService;

    @GetMapping
    public String greeting() {
        return greetingService.getGreeting();
    }
}
