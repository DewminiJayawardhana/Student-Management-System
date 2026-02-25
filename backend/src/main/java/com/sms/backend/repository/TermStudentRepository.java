package com.sms.backend.repository;


import com.sms.backend.model.TermStudent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TermStudentRepository extends MongoRepository<TermStudent, String> {
    List<TermStudent> findByGradeAndTermOrderByNameAsc(Integer grade, String term);
    Optional<TermStudent> findByGradeAndTermAndUsername(Integer grade, String term, String username);
}
