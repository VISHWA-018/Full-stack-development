package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.Course;

@Configuration
public class AppConfig {

    @Bean
    public Course course() {
        return new Course();
    }
}
