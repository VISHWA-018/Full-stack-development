package com.annotations.controller;

import com.annotations.model.Student;
import com.annotations.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Session 17: @RestController = @Controller + @ResponseBody (returns JSON)
@RestController
@RequestMapping("/api/students")
public class StudentRestController {

    // Session 18: @Autowired - Dependency Injection
    @Autowired
    private StudentService studentService;

    // Session 17: GET all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // Session 17: GET student by ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable("id") int id) {
        return studentService.getStudentById(id);
    }

    // Session 17: POST - Add new student
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentService.addStudent(student);
    }

    // Session 17: PUT - Update student
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable("id") int id, @RequestBody Student student) {
        return studentService.updateStudent(id, student);
    }

    // Session 17: DELETE - Remove student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable("id") int id) {
        boolean removed = studentService.deleteStudent(id);
        return removed ? "Student deleted successfully" : "Student not found";
    }
}
