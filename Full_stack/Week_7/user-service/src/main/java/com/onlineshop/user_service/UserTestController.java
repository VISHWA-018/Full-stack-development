package com.onlineshop.user_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserTestController {

    @GetMapping("/")
    public String status() {
        return "✅ User Microservice (Week 7) is LIVE and registered on Port 8071";
    }
}
