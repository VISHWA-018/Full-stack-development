package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.Course;
import com.example.demo.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final Course course;

    public StudentService(StudentRepository studentRepository, Course course) {
        this.studentRepository = studentRepository;
        this.course = course;
    }

    public String fetchStudentInfo() {
        return studentRepository.getStudentData() 
                + " | Course: " + course.getCourseName();
    }
}
