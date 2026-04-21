package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;

@Controller
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/")
    public String showForm(org.springframework.ui.Model model) {
        model.addAttribute("students", studentRepository.findAll());
        return "index";
    }

    @PostMapping("/saveStudent")
    public String saveStudent(
            @RequestParam("name") String name,
            @RequestParam("department") String department,
            @RequestParam("marks") Double marks) {

        Student student = new Student();
        student.setName(name);
        student.setDepartment(department);
        student.setMarks(marks);

        studentRepository.save(student); // 🔥 STORES INTO MYSQL

        return "redirect:/";
    }
}