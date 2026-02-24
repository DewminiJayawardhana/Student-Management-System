package com.sms.backend.controller;

import com.sms.backend.model.Student;
import com.sms.backend.service.StudentCsvService;
import com.sms.backend.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//for csv file
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    private final StudentCsvService csvService;

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PostMapping
    public Student create(@Valid @RequestBody Student student) {
        return studentService.create(student);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @GetMapping
    public List<Student> getAll() {
        return studentService.getAll();
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @GetMapping("/{id}")
    public Student getById(@PathVariable String id) {
        return studentService.getById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PutMapping("/{id}")
    public Student update(@PathVariable String id, @Valid @RequestBody Student student) {
        return studentService.update(id, student);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        studentService.delete(id);
    }
    //for csv file
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
@GetMapping("/export")
public ResponseEntity<String> exportCsv() throws Exception {
    String csv = csvService.exportToCsv(studentService.getAll());

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=students.csv")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csv);
}
}