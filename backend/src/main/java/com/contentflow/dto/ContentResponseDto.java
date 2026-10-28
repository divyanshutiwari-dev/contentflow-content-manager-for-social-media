package com.contentflow.dto;

import com.contentflow.model.Content;
import com.contentflow.model.ContentStatus;
import com.contentflow.model.ContentType;
import com.contentflow.model.Platform;
import java.time.LocalDateTime;

public class ContentResponseDto {

    private Long id;
    private String title;
    private String body;
    private ContentType contentType;
    private String contentTypeDisplay;
    private Platform platform;
    private String platformDisplay;
    private ContentStatus status;
    private String statusDisplay;
    private LocalDateTime scheduledAt;
    private String tags;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int characterCount;

    public ContentResponseDto() {
    }

    public static ContentResponseDto fromEntity(Content content) {
        if (content == null) {
            return null;
        }
        ContentResponseDto dto = new ContentResponseDto();
        dto.setId(content.getId());
        dto.setTitle(content.getTitle());
        dto.setBody(content.getBody());
        dto.setContentType(content.getContentType());
        dto.setContentTypeDisplay(content.getContentType() != null ? content.getContentType().getDisplayName() : "");
        dto.setPlatform(content.getPlatform());
        dto.setPlatformDisplay(content.getPlatform() != null ? content.getPlatform().getDisplayName() : "");
        dto.setStatus(content.getStatus());
        dto.setStatusDisplay(content.getStatus() != null ? content.getStatus().getDisplayName() : "");
        dto.setScheduledAt(content.getScheduledAt());
        dto.setTags(content.getTags());
        dto.setAuthor(content.getAuthor());
        dto.setCreatedAt(content.getCreatedAt());
        dto.setUpdatedAt(content.getUpdatedAt());
        dto.setCharacterCount(content.getBody() != null ? content.getBody().length() : 0);
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public String getContentTypeDisplay() {
        return contentTypeDisplay;
    }

    public void setContentTypeDisplay(String contentTypeDisplay) {
        this.contentTypeDisplay = contentTypeDisplay;
    }

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public String getPlatformDisplay() {
        return platformDisplay;
    }

    public void setPlatformDisplay(String platformDisplay) {
        this.platformDisplay = platformDisplay;
    }

    public ContentStatus getStatus() {
        return status;
    }

    public void setStatus(ContentStatus status) {
        this.status = status;
    }

    public String getStatusDisplay() {
        return statusDisplay;
    }

    public void setStatusDisplay(String statusDisplay) {
        this.statusDisplay = statusDisplay;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getCharacterCount() {
        return characterCount;
    }

    public void setCharacterCount(int characterCount) {
        this.characterCount = characterCount;
    }
}
