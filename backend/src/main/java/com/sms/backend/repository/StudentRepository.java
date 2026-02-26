package com.sms.backend.repository;

import com.sms.backend.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StudentRepository extends MongoRepository<Student, String> {
    List<Student> findByGradeOrderByNameAsc(Integer grade); // ✅ safer
    boolean existsByUsername(String username);
}