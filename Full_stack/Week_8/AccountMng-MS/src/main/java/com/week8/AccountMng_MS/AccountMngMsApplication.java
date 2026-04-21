package com.week8.accountmng_ms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class AccountMngMsApplication {

    private final JmsTemplate jmsTemplate;

    public AccountMngMsApplication(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }

    public static void main(String[] args) {
        SpringApplication.run(AccountMngMsApplication.class, args);
    }

    // Task 8.5: Send JMS Message
    @GetMapping("/api/account/send")
    public String sendMessage(@RequestParam(value = "msg", defaultValue = "Hello from Account!") String msg) {
        jmsTemplate.convertAndSend("account-queue", msg);
        return "Message sent to JMS queue: " + msg;
    }
}
