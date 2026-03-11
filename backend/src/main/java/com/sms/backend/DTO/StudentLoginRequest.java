package com.sms.backend.DTO;

public class StudentLoginRequest {
    private String username;
    private String password;

    public StudentLoginRequest() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

