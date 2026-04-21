package com.annotations.task44;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/task44")
public class NotificationController {

    private final NotificationService emailService;
    private final NotificationService smsService;

    @Autowired
    public NotificationController(
            @Qualifier("emailNotification") NotificationService emailService,
            @Qualifier("smsNotification") NotificationService smsService) {
        this.emailService = emailService;
        this.smsService = smsService;
    }

    @GetMapping("/email")
    public String sendEmail(@RequestParam(value = "msg", defaultValue = "Hello from Task 4.4!") String msg) {
        return emailService.sendNotification(msg);
    }

    @GetMapping("/sms")
    public String sendSms(@RequestParam(value = "msg", defaultValue = "Hello from Task 4.4!") String msg) {
        return smsService.sendNotification(msg);
    }
}
