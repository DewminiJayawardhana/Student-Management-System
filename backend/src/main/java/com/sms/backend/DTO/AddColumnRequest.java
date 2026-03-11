package com.sms.backend.DTO;

public class AddColumnRequest {
    private String name;
    private String updatedBy; 

    public AddColumnRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}