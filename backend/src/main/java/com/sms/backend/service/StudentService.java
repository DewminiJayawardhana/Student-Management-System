package com.sms.backend.service;

import com.sms.backend.model.Student;

import java.util.List;

public interface StudentService {
    List<Student> getByGrade(int grade);
    Student addStudent(Student student);
    Student updateStudent(String id, Student student);
    void deleteStudent(String id);

    // promote all students (UpToGrade)
    void promoteAll();
}