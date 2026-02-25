package com.sms.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "term_students")
public class TermStudent {

    @Id
    private String id;

    private String name;
    private String username;

    private Integer grade;   // 1..13
    private String term;     // A-I, A-II, ...

    public TermStudent() {}

    public TermStudent(String name, String username, Integer grade, String term) {
        this.name = name;
        this.username = username;
        this.grade = grade;
        this.term = term;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getGrade() { return grade; }
    public void setGrade(Integer grade) { this.grade = grade; }

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }
}