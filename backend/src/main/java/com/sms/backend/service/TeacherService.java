package com.sms.backend.service;

import com.sms.backend.model.Teacher;

import java.util.List;

public interface TeacherService {
    List<Teacher> getAll();
    Teacher add(Teacher teacher);
    Teacher update(String id, Teacher teacher);
    void delete(String id);
}