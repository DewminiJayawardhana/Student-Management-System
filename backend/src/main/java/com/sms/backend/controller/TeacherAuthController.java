package com.sms.backend.controller;

import com.sms.backend.DTO.RegisterTeacherRequest;
import com.sms.backend.DTO.TeacherLoginRequest;
import com.sms.backend.model.Teacher;
import com.sms.backend.model.TeacherUser;
import com.sms.backend.repository.TeacherRepository;
import com.sms.backend.repository.TeacherUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.sms.backend.DTO.UpdateTeacherProfileRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher-auth")
@CrossOrigin
public class TeacherAuthController {

    private final TeacherRepository teacherRepo;
    private final TeacherUserRepository teacherUserRepo;
    private final PasswordEncoder passwordEncoder;

    public TeacherAuthController(TeacherRepository teacherRepo,
                                 TeacherUserRepository teacherUserRepo,
                                 PasswordEncoder passwordEncoder) {
        this.teacherRepo = teacherRepo;
        this.teacherUserRepo = teacherUserRepo;
        this.passwordEncoder = passwordEncoder;
    }

    //REGISTER (pre-approved by admin)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterTeacherRequest req) {

        if (req.getUsername() == null || req.getPassword() == null ||
                req.getName() == null || req.getSubject() == null || req.getEmail() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All fields are required.");
        }

        String username = req.getUsername().trim();

        Teacher approved = teacherRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Username not found. Contact admin."
                ));

        if (approved.isRegistered() || teacherUserRepo.findByUsername(username).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This username is already registered.");
        }

        TeacherUser user = new TeacherUser();
        user.setUsername(username);
        user.setName(req.getName().trim());
        user.setSubject(req.getSubject().trim());
        user.setEmail(req.getEmail().trim());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole("TEACHER");

        TeacherUser saved = teacherUserRepo.save(user);

        approved.setRegistered(true);
        approved.setTeacherUserId(saved.getId());
        teacherRepo.save(approved);

        return ResponseEntity.ok(Map.of("message", "Registration successful. Please login."));
    }

    //LOGIN (teacher)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody TeacherLoginRequest req) {

        if (req.getUsername() == null || req.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username and password are required.");
        }

        String username = req.getUsername().trim();

        TeacherUser user = teacherUserRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "role", "TEACHER",
                "username", user.getUsername()
        ));
    }
    //GET teacher profile by username (read-only)
@GetMapping("/me/{username}")
public ResponseEntity<?> me(@PathVariable String username) {
    TeacherUser user = teacherUserRepo.findByUsername(username.trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

    return ResponseEntity.ok(Map.of(
            "username", user.getUsername(),
            "name", user.getName(),
            "subject", user.getSubject(),
            "email", user.getEmail(),
            "role", user.getRole()
    ));
}

//UPDATE teacher profile (username NOT editable)
@PutMapping("/me/{username}")
public ResponseEntity<?> updateMe(@PathVariable String username,
                                 @RequestBody UpdateTeacherProfileRequest req) {

    TeacherUser user = teacherUserRepo.findByUsername(username.trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

    // update allowed fields only
    if (req.getName() != null) user.setName(req.getName().trim());
    if (req.getSubject() != null) user.setSubject(req.getSubject().trim());
    if (req.getEmail() != null) user.setEmail(req.getEmail().trim());

    // password optional
    if (req.getPassword() != null && !req.getPassword().trim().isEmpty()) {
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
    }

    teacherUserRepo.save(user);

    return ResponseEntity.ok(Map.of("message", "Profile updated"));
}
}