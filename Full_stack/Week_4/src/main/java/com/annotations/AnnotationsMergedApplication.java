package com.annotations;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Session 16: @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan
@SpringBootApplication
public class AnnotationsMergedApplication {
    public static void main(String[] args) {
        SpringApplication.run(AnnotationsMergedApplication.class, args);
    }
}
