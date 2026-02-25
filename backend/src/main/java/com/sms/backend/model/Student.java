package com.sms.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
public class Student {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String username; // unique

    private int grade;       // 1 - 13
    private String classRoom; // "A", "B", "C"

    public Student() {}

    public Student(String id, String name, String username, int grade, String classRoom) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.grade = grade;
        this.classRoom = classRoom;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public int getGrade() { return grade; }
    public void setGrade(int grade) { this.grade = grade; }

    public String getClassRoom() { return classRoom; }
    public void setClassRoom(String classRoom) { this.classRoom = classRoom; }
}