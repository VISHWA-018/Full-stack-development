package com.annotations.task42;

import org.springframework.stereotype.Service;

@Service
public class GreetingService {
    public String getGreeting() {
        return "Hello from Task 4.2 - Field Injection Service!";
    }
}
