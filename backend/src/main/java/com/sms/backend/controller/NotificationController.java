package com.sms.backend.controller;

import com.sms.backend.service.NotificationSseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationSseService sse;

    @GetMapping("/stream")
    public SseEmitter stream() {
        return sse.connect();
    }
}