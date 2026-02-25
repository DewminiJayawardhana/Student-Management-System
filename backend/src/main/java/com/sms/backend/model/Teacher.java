package com.sms.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "teachers")
public class Teacher {

    @Id
    private String id;

    private String name;         // teacher name
    private String subjects;     // ex: "Math, Science"

    @Indexed(unique = true)
    private String username;     // unique username

    @Indexed(unique = true)
    private String email;        // unique email

    private String telNumber;    // phone number

    public Teacher() {}

    public Teacher(String id, String name, String subjects, String username, String email, String telNumber) {
        this.id = id;
        this.name = name;
        this.subjects = subjects;
        this.username = username;
        this.email = email;
        this.telNumber = telNumber;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSubjects() { return subjects; }
    public void setSubjects(String subjects) { this.subjects = subjects; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelNumber() { return telNumber; }
    public void setTelNumber(String telNumber) { this.telNumber = telNumber; }
}