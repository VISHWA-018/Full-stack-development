package com.example.demo.model;

import jakarta.persistence.*;

// Task 5.2: JPA Annotations @Entity, @Table
@Entity
@Table(name = "student")
public class Student {

    // Task 5.2: @Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Task 5.2: @Column
    @Column(name = "student_name", nullable = false)
    private String name;

    @Column(name = "department")
    private String department;

    @Column(name = "marks")
    private Double marks;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }
}