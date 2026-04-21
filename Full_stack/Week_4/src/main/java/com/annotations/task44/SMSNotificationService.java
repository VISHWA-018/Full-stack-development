package com.annotations.task44;

import org.springframework.stereotype.Service;

@Service("smsNotification")
public class SMSNotificationService implements NotificationService {
    @Override
    public String sendNotification(String message) {
        return "Sending SMS: " + message;
    }
}
