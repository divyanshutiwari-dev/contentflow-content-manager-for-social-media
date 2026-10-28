package com.contentflow.controller;

import com.contentflow.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> status = Map.of(
                "status", "UP",
                "service", "ContentFlow API",
                "version", "1.0.0",
                "database", "H2 File-based Persistence",
                "timestamp", LocalDateTime.now()
        );
        return ResponseEntity.ok(ApiResponse.ok("Service is healthy and operating normally", status));
    }
}
