package com.annotations.controller;

import com.annotations.model.Student;
import com.annotations.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

// Session 20: @Controller - returns HTML views via Thymeleaf (MVC pattern)
@Controller
@RequestMapping("/students")
public class StudentMvcController {

    @Autowired
    private StudentService studentService;

    // Show all students page
    @GetMapping
    public String listStudents(Model model) {
        model.addAttribute("students", studentService.getAllStudents());
        model.addAttribute("title", "Student List");
        return "students/list";   // maps to templates/students/list.html
    }

    // Show add student form
    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("student", new Student());
        return "students/form";
    }

    // Handle form submission
    @PostMapping("/add")
    public String addStudent(@ModelAttribute Student student) {
        studentService.addStudent(student);
        return "redirect:/students";
    }

    // Delete a student
    @GetMapping("/delete/{id}")
    public String deleteStudent(@PathVariable("id") int id) {
        studentService.deleteStudent(id);
        return "redirect:/students";
    }
}
