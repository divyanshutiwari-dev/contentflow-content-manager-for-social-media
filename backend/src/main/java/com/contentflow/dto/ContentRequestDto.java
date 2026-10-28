package com.contentflow.dto;

import com.contentflow.model.ContentStatus;
import com.contentflow.model.ContentType;
import com.contentflow.model.Platform;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class ContentRequestDto {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Content body is required")
    private String body;

    @NotNull(message = "Content type is required")
    private ContentType contentType;

    @NotNull(message = "Platform is required")
    private Platform platform;

    @NotNull(message = "Status is required")
    private ContentStatus status;

    private LocalDateTime scheduledAt;

    @Size(max = 255, message = "Tags cannot exceed 255 characters")
    private String tags;

    @Size(max = 100, message = "Author name cannot exceed 100 characters")
    private String author;

    public ContentRequestDto() {
    }

    public ContentRequestDto(String title, String body, ContentType contentType, Platform platform,
                             ContentStatus status, LocalDateTime scheduledAt, String tags, String author) {
        this.title = title;
        this.body = body;
        this.contentType = contentType;
        this.platform = platform;
        this.status = status;
        this.scheduledAt = scheduledAt;
        this.tags = tags;
        this.author = author;
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

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public ContentStatus getStatus() {
        return status;
    }

    public void setStatus(ContentStatus status) {
        this.status = status;
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
}
