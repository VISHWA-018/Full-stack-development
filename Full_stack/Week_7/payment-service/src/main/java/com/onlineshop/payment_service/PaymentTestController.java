package com.onlineshop.payment_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentTestController {

    @GetMapping("/")
    public String status() {
        return "✅ Payment Microservice (Week 7) is LIVE and registered on Port 8073";
    }
}
