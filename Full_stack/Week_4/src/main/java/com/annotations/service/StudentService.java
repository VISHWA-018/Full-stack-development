package com.annotations.service;

import com.annotations.model.Student;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// Session 18: @Service - marks this class as a business logic layer component
@Service
public class StudentService {

    // In-memory data store (no DB needed for Week 4)
    private List<Student> students = new ArrayList<>();
    private int nextId = 1;

    public StudentService() {
        // Preloaded sample data
        students.add(new Student(nextId++, "Rama", "CSE", 92.5));
        students.add(new Student(nextId++, "Arjun", "IT", 85.0));
        students.add(new Student(nextId++, "Priya", "ECE", 78.3));
    }

    public List<Student> getAllStudents() {
        return students;
    }

    public Student getStudentById(int id) {
        return students.stream()
                .filter(s -> s.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public Student addStudent(Student student) {
        student.setId(nextId++);
        students.add(student);
        return student;
    }

    public Student updateStudent(int id, Student updated) {
        for (Student s : students) {
            if (s.getId() == id) {
                s.setName(updated.getName());
                s.setDepartment(updated.getDepartment());
                s.setMarks(updated.getMarks());
                return s;
            }
        }
        return null;
    }

    public boolean deleteStudent(int id) {
        return students.removeIf(s -> s.getId() == id);
    }
}
