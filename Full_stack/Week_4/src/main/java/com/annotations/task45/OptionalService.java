package com.annotations.task45;

import org.springframework.stereotype.Service;

// Notice this class does NOT have @Service or @Component annotation
// It represents a component that "might or might not be present"
public class OptionalService {
    public String getInfo() {
        return "Optional Service is successfully instantiated and available!";
    }
}
