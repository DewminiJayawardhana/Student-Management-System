package com.sms.backend.controller;

import com.sms.backend.model.Teacher;
import com.sms.backend.service.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService service;

    public TeacherController(TeacherService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Teacher>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Teacher> add(@RequestBody Teacher teacher) {
        return ResponseEntity.ok(service.add(teacher));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teacher> update(@PathVariable String id, @RequestBody Teacher teacher) {
        return ResponseEntity.ok(service.update(id, teacher));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}