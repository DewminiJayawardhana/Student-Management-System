package com.sms.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    private String id;

    private String actorEmail;   // from JWT
    private String actorRole;    // ADMIN / STAFF
    private String action;       // CREATE_STUDENT, UPDATE_STUDENT, DELETE_STUDENT
    private String entity;       // STUDENT
    private String entityRef;    // studentCode

    private Instant timestamp;
}