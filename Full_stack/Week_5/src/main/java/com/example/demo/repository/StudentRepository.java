package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Student;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    
    // Task 5.4: Custom query methods
    List<Student> findByDepartment(String department);
    
    List<Student> findByMarksGreaterThan(Double marks);
}