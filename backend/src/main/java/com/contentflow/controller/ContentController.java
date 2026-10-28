package com.contentflow.controller;

import com.contentflow.dto.ApiResponse;
import com.contentflow.dto.ContentRequestDto;
import com.contentflow.dto.ContentResponseDto;
import com.contentflow.dto.DashboardStatsDto;
import com.contentflow.model.ContentStatus;
import com.contentflow.model.Platform;
import com.contentflow.service.ContentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contents")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContentResponseDto>>> getAllContents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ContentStatus status,
            @RequestParam(required = false) Platform platform,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir) {

        String searchTerm = (search != null && !search.isBlank()) ? search : keyword;
        List<ContentResponseDto> contents = contentService.getAllContents(searchTerm, status, platform, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.ok("Retrieved " + contents.size() + " content items", contents));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContentResponseDto>> getContentById(@PathVariable Long id) {
        ContentResponseDto content = contentService.getContentById(id);
        return ResponseEntity.ok(ApiResponse.ok("Content retrieved successfully", content));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContentResponseDto>> createContent(@Valid @RequestBody ContentRequestDto requestDto) {
        ContentResponseDto created = contentService.createContent(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Content created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ContentResponseDto>> updateContent(
            @PathVariable Long id,
            @Valid @RequestBody ContentRequestDto requestDto) {
        ContentResponseDto updated = contentService.updateContent(id, requestDto);
        return ResponseEntity.ok(ApiResponse.ok("Content updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.ok(ApiResponse.ok("Content deleted successfully with ID: " + id, null));
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<ApiResponse<ContentResponseDto>> duplicateContent(@PathVariable Long id) {
        ContentResponseDto duplicated = contentService.duplicateContent(id);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Content duplicated successfully as draft", duplicated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ContentResponseDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        if (statusStr == null || statusStr.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing 'status' in request body"));
        }
        ContentStatus newStatus = ContentStatus.valueOf(statusStr.toUpperCase());
        ContentResponseDto updated = contentService.updateStatus(id, newStatus);
        return ResponseEntity.ok(ApiResponse.ok("Content status updated to " + newStatus, updated));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = contentService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved successfully", stats));
    }

    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<List<ContentResponseDto>>> getCalendarEvents(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        List<ContentResponseDto> events = contentService.getCalendarEvents(year, month);
        return ResponseEntity.ok(ApiResponse.ok("Calendar events retrieved successfully", events));
    }
}
