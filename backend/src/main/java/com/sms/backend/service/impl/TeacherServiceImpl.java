package com.sms.backend.service.impl;

import com.sms.backend.model.Teacher;
import com.sms.backend.repository.TeacherRepository;
import com.sms.backend.service.TeacherService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository repo;

    public TeacherServiceImpl(TeacherRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Teacher> getAll() {
        return repo.findAll();
    }

    @Override
    public Teacher add(Teacher t) {
        validate(t);

        if (repo.existsByUsername(t.getUsername())) throw new DuplicateKeyException("Username already exists");
        if (repo.existsByEmail(t.getEmail())) throw new DuplicateKeyException("Email already exists");

        return repo.save(t);
    }

    @Override
    public Teacher update(String id, Teacher t) {
        validate(t);

        Teacher existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (!existing.getUsername().equals(t.getUsername()) && repo.existsByUsername(t.getUsername())) {
            throw new DuplicateKeyException("Username already exists");
        }
        if (!existing.getEmail().equals(t.getEmail()) && repo.existsByEmail(t.getEmail())) {
            throw new DuplicateKeyException("Email already exists");
        }

        existing.setName(t.getName());
        existing.setSubjects(t.getSubjects());
        existing.setUsername(t.getUsername());
        existing.setEmail(t.getEmail());
        existing.setTelNumber(t.getTelNumber());

        return repo.save(existing);
    }

    @Override
    public void delete(String id) {
        repo.deleteById(id);
    }

    private void validate(Teacher t) {
        if (t.getName() == null || t.getName().trim().isEmpty()) throw new RuntimeException("Name required");
        if (t.getSubjects() == null || t.getSubjects().trim().isEmpty()) throw new RuntimeException("Subjects required");
        if (t.getUsername() == null || t.getUsername().trim().isEmpty()) throw new RuntimeException("Username required");
        if (t.getEmail() == null || t.getEmail().trim().isEmpty()) throw new RuntimeException("Email required");
        if (t.getTelNumber() == null || t.getTelNumber().trim().isEmpty()) throw new RuntimeException("Tel number required");
    }
}