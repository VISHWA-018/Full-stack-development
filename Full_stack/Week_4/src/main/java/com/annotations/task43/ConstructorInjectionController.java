package com.annotations.task43;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/task43")
public class ConstructorInjectionController {

    private final PaymentService paymentService;

    // Constructor Injection
    @Autowired
    public ConstructorInjectionController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/pay")
    public String pay(@RequestParam(value = "amount", defaultValue = "100.0") double amount) {
        return paymentService.processPayment(amount);
    }
}
