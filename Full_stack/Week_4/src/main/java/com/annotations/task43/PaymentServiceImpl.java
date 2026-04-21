package com.annotations.task43;

import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Override
    public String processPayment(double amount) {
        return "Payment of $" + amount + " processed successfully via Constructor Injection!";
    }
}
