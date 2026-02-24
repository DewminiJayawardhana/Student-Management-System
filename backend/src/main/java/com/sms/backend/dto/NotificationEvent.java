package com.sms.backend.dto;

import java.time.Instant;

public record NotificationEvent(
        String message,
        String action,
        String studentCode,
        String byRole,
        String byName,
        Instant time
) {}