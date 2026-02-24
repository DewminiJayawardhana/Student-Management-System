package com.sms.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DebugController {

    @GetMapping("/api/auth/me")
    public Map<String, Object> me(Authentication auth) {
        return Map.of(
                "name", auth == null ? null : auth.getName(),
                "authorities", auth == null ? null : auth.getAuthorities()
        );
    }
}