package com.annotations.task44;

import org.springframework.stereotype.Service;

@Service("emailNotification")
public class EmailNotificationService implements NotificationService {
    @Override
    public String sendNotification(String message) {
        return "Sending Email: " + message;
    }
}
