package com.sms.backend.DTO;

public class UpdateTeacherProfileRequest {
    private String name;
    private String subject;
    private String email;
    private String password; 
    public UpdateTeacherProfileRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}