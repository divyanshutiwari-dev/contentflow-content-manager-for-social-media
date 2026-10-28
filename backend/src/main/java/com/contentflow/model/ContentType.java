package com.contentflow.model;

public enum ContentType {
    SOCIAL_POST("Social Media Post"),
    BLOG_DRAFT("Blog Draft");

    private final String displayName;

    ContentType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
