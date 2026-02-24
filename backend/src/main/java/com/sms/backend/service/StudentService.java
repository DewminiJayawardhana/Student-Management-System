package com.sms.backend.service;

import com.sms.backend.dto.NotificationEvent;
import com.sms.backend.model.Student;
import com.sms.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepo;
    private final StudentCodeService codeService;
    private final AuditLogService auditLogService;
    private final NotificationSseService sse;

    private String currentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth == null ? "Unknown" : auth.getName();
    }

    private String currentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getAuthorities().isEmpty()) return "UNKNOWN";
        return auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
    }

    public Student create(Student student) {
        if (studentRepo.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        student.setStudentCode(codeService.nextStudentCode());
        student.setCreatedAt(Instant.now());
        student.setUpdatedAt(Instant.now());

        try {
            Student saved = studentRepo.save(student);

            auditLogService.log("CREATE_STUDENT", "STUDENT", saved.getStudentCode());

            // ✅ SSE notify
            sse.send(new NotificationEvent(
                    "New student added: " + saved.getStudentCode() + " by " + currentUserRole() + " (" + currentUserEmail() + ")",
                    "CREATE",
                    saved.getStudentCode(),
                    currentUserRole(),
                    currentUserEmail(),
                    Instant.now()
            ));

            return saved;

        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Duplicate key (email or studentCode)");
        }
    }

    public List<Student> getAll() {
        return studentRepo.findAll();
    }

    public Student getById(String id) {
        return studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student update(String id, Student updated) {
        Student existing = getById(id);

        if (!existing.getEmail().equals(updated.getEmail()) && studentRepo.existsByEmail(updated.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        existing.setFullName(updated.getFullName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        existing.setGrade(updated.getGrade());
        existing.setActive(updated.isActive());
        existing.setUpdatedAt(Instant.now());

        Student saved = studentRepo.save(existing);

        auditLogService.log("UPDATE_STUDENT", "STUDENT", saved.getStudentCode());

        // ✅ SSE notify
        sse.send(new NotificationEvent(
                "Student " + saved.getStudentCode() + " updated by " + currentUserRole() + " (" + currentUserEmail() + ")",
                "UPDATE",
                saved.getStudentCode(),
                currentUserRole(),
                currentUserEmail(),
                Instant.now()
        ));

        return saved;
    }

    public void delete(String id) {
        Student s = getById(id);

        auditLogService.log("DELETE_STUDENT", "STUDENT", s.getStudentCode());

        studentRepo.delete(s);

        // ✅ SSE notify
        sse.send(new NotificationEvent(
                "Student " + s.getStudentCode() + " deleted by " + currentUserRole() + " (" + currentUserEmail() + ")",
                "DELETE",
                s.getStudentCode(),
                currentUserRole(),
                currentUserEmail(),
                Instant.now()
        ));
    }
}