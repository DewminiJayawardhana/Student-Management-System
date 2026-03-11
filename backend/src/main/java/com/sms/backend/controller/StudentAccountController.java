package com.sms.backend.controller;

import com.sms.backend.DTO.StudentLoginRequest;
import com.sms.backend.model.Student;
import com.sms.backend.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/student-account")
@CrossOrigin
public class StudentAccountController {

    private final StudentRepository studentRepo;

    public StudentAccountController(StudentRepository studentRepo) {
        this.studentRepo = studentRepo;
    }

   
    //ME (fetch profile from DB) - STRICT: uses header X-Student-Id
    @GetMapping("/me")
    public Map<String, Object> me(@RequestHeader("X-Student-Id") String studentId) {
        if (studentId == null || studentId.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing student session.");
        }

        Student s = studentRepo.findById(studentId.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Student not found."));

        return Map.of(
                "id", s.getId(),
                "name", s.getName(),
                "username", s.getUsername(),
                "grade", s.getGrade(),
                "classRoom", s.getClassRoom()
        );
    }
}