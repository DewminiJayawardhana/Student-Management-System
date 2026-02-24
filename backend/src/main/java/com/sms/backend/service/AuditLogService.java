package com.sms.backend.service;

import com.sms.backend.model.AuditLog;
import com.sms.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository repo;

    public void log(String action, String entity, String entityRef) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        AuditLog log = AuditLog.builder()
                .actorEmail(email)
                .actorRole(role.replace("ROLE_", ""))
                .action(action)
                .entity(entity)
                .entityRef(entityRef)
                .timestamp(Instant.now())
                .build();

        repo.save(log);
    }
}