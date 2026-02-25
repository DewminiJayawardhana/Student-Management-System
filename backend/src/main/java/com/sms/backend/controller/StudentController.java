package com.sms.backend.controller;

import com.sms.backend.model.Student;
import com.sms.backend.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000") // React
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // GET /api/students?grade=1
    @GetMapping
    public ResponseEntity<List<Student>> getByGrade(@RequestParam int grade) {
        return ResponseEntity.ok(service.getByGrade(grade));
    }

    // POST /api/students
    @PostMapping
    public ResponseEntity<Student> add(@RequestBody Student student) {
        return ResponseEntity.ok(service.addStudent(student));
    }

    // PUT /api/students/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable String id, @RequestBody Student student) {
        return ResponseEntity.ok(service.updateStudent(id, student));
    }

    // DELETE /api/students/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // POST /api/students/promote
    @PostMapping("/promote")
    public ResponseEntity<String> promoteAll() {
        service.promoteAll();
        return ResponseEntity.ok("Promoted successfully");
    }
}