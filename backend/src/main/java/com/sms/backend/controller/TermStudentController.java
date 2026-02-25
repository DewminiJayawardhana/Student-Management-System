package com.sms.backend.controller;

import com.sms.backend.model.TermStudent;
import com.sms.backend.repository.TermStudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/term-students")
public class TermStudentController {

    private final TermStudentRepository repo;

    public TermStudentController(TermStudentRepository repo) {
        this.repo = repo;
    }

    // ✅ list by grade+term
    @GetMapping
    public List<TermStudent> list(@RequestParam Integer grade, @RequestParam String term) {
        return repo.findByGradeAndTermOrderByNameAsc(grade, term);
    }

    // ✅ add
    @PostMapping
    public TermStudent add(@RequestBody TermStudent s) {
        if (s.getGrade() == null || s.getTerm() == null || s.getName() == null || s.getUsername() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All fields required");

        repo.findByGradeAndTermAndUsername(s.getGrade(), s.getTerm(), s.getUsername().trim())
                .ifPresent(x -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists in this class"); });

        s.setName(s.getName().trim());
        s.setUsername(s.getUsername().trim());
        s.setTerm(s.getTerm().trim());

        return repo.save(s);
    }

    // ✅ update
    @PutMapping("/{id}")
    public TermStudent update(@PathVariable String id, @RequestBody TermStudent s) {
        TermStudent ex = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

        ex.setName(s.getName() == null ? ex.getName() : s.getName().trim());
        ex.setUsername(s.getUsername() == null ? ex.getUsername() : s.getUsername().trim());
        // grade & term should not change here (keep it fixed)
        return repo.save(ex);
    }

    // ✅ delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repo.deleteById(id);
    }
}
