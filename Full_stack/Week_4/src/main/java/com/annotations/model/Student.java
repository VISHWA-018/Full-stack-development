package com.annotations.model;

// Session 16-17: Plain Java Model (POJO) used across REST and MVC layers
public class Student {

    private int id;
    private String name;
    private String department;
    private double marks;

    // Default constructor
    public Student() {}

    // Parameterized constructor
    public Student(int id, String name, String department, double marks) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.marks = marks;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public double getMarks() { return marks; }
    public void setMarks(double marks) { this.marks = marks; }

    @Override
    public String toString() {
        return "Student{id=" + id + ", name='" + name + "', department='" + department + "', marks=" + marks + "}";
    }
}
