package com.sms.backend.service.impl;

import com.sms.backend.model.Student;
import com.sms.backend.repository.StudentRepository;
import com.sms.backend.service.StudentService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository repo;

    public StudentServiceImpl(StudentRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Student> getByGrade(int grade) {
        return repo.findByGradeOrderByNameAsc(grade);
    }

    @Override
    public Student addStudent(Student student) {
        validate(student);

        // Username unique check (extra safety; Mongo unique index also helps)
        if (repo.existsByUsername(student.getUsername())) {
            throw new DuplicateKeyException("Username already exists");
        }

        return repo.save(student);
    }

    @Override
    public Student updateStudent(String id, Student student) {
        validate(student);

        Student existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // If username changed, check unique
        if (!existing.getUsername().equals(student.getUsername())
                && repo.existsByUsername(student.getUsername())) {
            throw new DuplicateKeyException("Username already exists");
        }

        existing.setName(student.getName());
        existing.setUsername(student.getUsername());
        existing.setGrade(student.getGrade());
        existing.setClassRoom(student.getClassRoom());

        return repo.save(existing);
    }

    @Override
    public void deleteStudent(String id) {
        repo.deleteById(id);
    }

    @Override
    public void promoteAll() {
        List<Student> all = repo.findAll();

        for (Student s : all) {
            int g = s.getGrade();
            if (g >= 13) {
                // Grade 13 removed
                repo.deleteById(s.getId());
            } else {
                s.setGrade(g + 1);
                repo.save(s);
            }
        }
    }

    private void validate(Student s) {
        if (s.getName() == null || s.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (s.getUsername() == null || s.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (s.getGrade() < 1 || s.getGrade() > 13) {
            throw new RuntimeException("Grade must be 1 to 13");
        }
        if (s.getClassRoom() == null ||
                !(s.getClassRoom().equals("A") || s.getClassRoom().equals("B") || s.getClassRoom().equals("C"))) {
            throw new RuntimeException("Class must be A, B, or C");
        }
    }
}