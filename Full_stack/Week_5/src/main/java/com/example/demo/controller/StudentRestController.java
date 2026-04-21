package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

// Task 5.3: CRUD application using Spring Boot for Postman
@RestController
@RequestMapping("/api/students")
public class StudentRestController {

    @Autowired
    private StudentRepository studentRepository;

    // CREATE
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    // READ (All)
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // READ (By ID)
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable("id") Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable("id") Long id, @RequestBody Student studentDetails) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isPresent()) {
            Student existing = optionalStudent.get();
            existing.setName(studentDetails.getName());
            existing.setDepartment(studentDetails.getDepartment());
            existing.setMarks(studentDetails.getMarks());
            return studentRepository.save(existing);
        }
        return null; // For simplicity in Week 5
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable("id") Long id) {
        studentRepository.deleteById(id);
        return "Student " + id + " has been successfully deleted.";
    }

    // ---------------------------------------------------------
    // Task 5.4: Custom Spring Data JPA Query Endpoints
    // ---------------------------------------------------------

    // Find by Department (e.g. GET /api/students/department/CSE)
    @GetMapping("/department/{dept}")
    public List<Student> getStudentsByDepartment(@PathVariable("dept") String dept) {
        return studentRepository.findByDepartment(dept);
    }

    // Find by Marks Greater Than (e.g. GET /api/students/marks-greater-than/80.0)
    @GetMapping("/marks-greater-than/{marks}")
    public List<Student> getStudentsByMarks(@PathVariable("marks") Double marks) {
        return studentRepository.findByMarksGreaterThan(marks);
    }

    // ---------------------------------------------------------
    // Task 5.5: Sorting and Pagination
    // ---------------------------------------------------------

    // Example: GET /api/students/paged?page=0&size=5&sortBy=name&sortDir=asc
    @GetMapping("/paged")
    public Page<Student> getStudentsPaged(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                    Sort.by(sortBy).ascending() : 
                    Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return studentRepository.findAll(pageable);
    }
}
