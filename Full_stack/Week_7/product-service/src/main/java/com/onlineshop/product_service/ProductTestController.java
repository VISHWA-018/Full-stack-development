package com.onlineshop.product_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductTestController {

    @GetMapping("/")
    public String status() {
        return "✅ Product Microservice (Week 7) is LIVE and registered on Port 8072";
    }
}
