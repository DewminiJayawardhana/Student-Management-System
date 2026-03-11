package com.sms.backend.controller;

import com.sms.backend.model.ChangeLog;
import com.sms.backend.repository.ChangeLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin
public class ChangeHistoryController {

    private final ChangeLogRepository repo;

    public ChangeHistoryController(ChangeLogRepository repo) {
        this.repo = repo;
    }

    
    @GetMapping
    public List<ChangeLog> list(@RequestParam String entityType,
                                @RequestParam String entityKey) {
        return repo.findByEntityTypeAndEntityKeyOrderByCreatedAtDesc(
                entityType.trim(),
                entityKey.trim()
        );
    }
}