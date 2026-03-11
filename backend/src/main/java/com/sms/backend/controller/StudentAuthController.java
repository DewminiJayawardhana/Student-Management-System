package com.sms.backend.controller;

import com.sms.backend.DTO.RegisterStudentRequest;
import com.sms.backend.DTO.StudentLoginRequest;
import com.sms.backend.model.Student;
import com.sms.backend.model.StudentUser;
import com.sms.backend.repository.StudentRepository;
import com.sms.backend.repository.StudentUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/student-auth")
@CrossOrigin
public class StudentAuthController {

    private final StudentRepository studentRepo;
    private final StudentUserRepository studentUserRepo;
    private final PasswordEncoder passwordEncoder;

    public StudentAuthController(StudentRepository studentRepo,
                                 StudentUserRepository studentUserRepo,
                                 PasswordEncoder passwordEncoder) {
        this.studentRepo = studentRepo;
        this.studentUserRepo = studentUserRepo;
        this.passwordEncoder = passwordEncoder;
    }

    //REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterStudentRequest req) {

        String username = req.getUsername() == null ? "" : req.getUsername().trim();
        String name = req.getName() == null ? "" : req.getName().trim();
        String password = req.getPassword() == null ? "" : req.getPassword().trim();

        if (username.isEmpty() || name.isEmpty() || password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All fields are required.");
        }

        // 1) must exist in approved list
        Student approved = studentRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Username not found. Contact admin."
                ));

        // 2) already registered?
        if (approved.isRegistered() || studentUserRepo.findByUsername(username).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This username is already registered.");
        }

        // 3) create student user auth record
        StudentUser user = new StudentUser();
        user.setUsername(username);
        user.setName(name);
        user.setPasswordHash(passwordEncoder.encode(password));
        StudentUser saved = studentUserRepo.save(user);

        // 4) link + mark registered
        approved.setName(name);
        approved.setRegistered(true);
        approved.setStudentUserId(saved.getId());
        studentRepo.save(approved);

        return ResponseEntity.ok(Map.of("message", "Registration successful. Please login."));
    }

    //LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody StudentLoginRequest req) {
        String username = req.getUsername() == null ? "" : req.getUsername().trim();
        String password = req.getPassword() == null ? "" : req.getPassword().trim();

        if (username.isEmpty() || password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username and password required.");
        }

        StudentUser user = studentUserRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid username or password."));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid username or password.");
        }

        Student approved = studentRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student record not found. Contact admin."));

        if (!approved.isRegistered()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not registered yet.");
        }

        return ResponseEntity.ok(Map.of(
                "message", "Login success",
                "id", approved.getId(),
                "name", approved.getName(),
                "username", approved.getUsername(),
                "grade", approved.getGrade(),
                "classRoom", approved.getClassRoom(),
                "role", "STUDENT"
        ));
    }
}


