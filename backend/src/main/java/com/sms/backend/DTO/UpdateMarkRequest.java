package com.sms.backend.DTO;

public class UpdateMarkRequest {
    private String studentId;
    private String columnKey;
    private Integer value;     // 0-100
    private String updatedBy;  

    public UpdateMarkRequest() {}

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getColumnKey() { return columnKey; }
    public void setColumnKey(String columnKey) { this.columnKey = columnKey; }

    public Integer getValue() { return value; }
    public void setValue(Integer value) { this.value = value; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}