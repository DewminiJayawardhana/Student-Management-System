package com.sms.backend.controller;

import com.sms.backend.DTO.SaveMarkRequest;
import com.sms.backend.model.StudentMark;
import com.sms.backend.repository.StudentMarkRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin
public class MarksController {

    private final StudentMarkRepository repo;

    public MarksController(StudentMarkRepository repo) {
        this.repo = repo;
    }

    //Get marks for a class+term+subject
    @GetMapping
    public List<StudentMark> list(
            @RequestParam Integer grade,
            @RequestParam String classRoom,
            @RequestParam String term,
            @RequestParam String subject
    ) {
        return repo.findByGradeAndClassRoomAndTermAndSubject(
                grade,
                classRoom.trim().toUpperCase(),
                term.trim(),
                subject.trim()
        );
    }

    //Save/Update one mark (UPSERT)
    @PutMapping
    public ResponseEntity<?> save(@RequestBody SaveMarkRequest req) {
        if (req.getStudentId() == null || req.getGrade() == null ||
                req.getClassRoom() == null || req.getTerm() == null ||
                req.getSubject() == null || req.getTeacherUsername() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing required fields");
        }

        if (req.getMarks() == null || req.getMarks() < 0 || req.getMarks() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Marks must be between 0 and 100");
        }

        String studentId = req.getStudentId().trim();
        String term = req.getTerm().trim();
        String subject = req.getSubject().trim();

        StudentMark mark = repo.findByStudentIdAndTermAndSubject(studentId, term, subject)
                .orElseGet(StudentMark::new);

        mark.setStudentId(studentId);
        mark.setGrade(req.getGrade());
        mark.setClassRoom(req.getClassRoom().trim().toUpperCase());
        mark.setTerm(term);
        mark.setSubject(subject);
        mark.setMarks(req.getMarks());
        mark.setTeacherUsername(req.getTeacherUsername().trim());

        repo.save(mark);

        return ResponseEntity.ok(Map.of("message", "Saved"));
    }
}