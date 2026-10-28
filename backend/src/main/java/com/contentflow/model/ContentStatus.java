package com.contentflow.model;

public enum ContentStatus {
    DRAFT("Draft"),
    SCHEDULED("Scheduled"),
    PUBLISHED("Published"),
    ARCHIVED("Archived");

    private final String displayName;

    ContentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
