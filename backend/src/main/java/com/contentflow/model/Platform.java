package com.contentflow.model;

public enum Platform {
    INSTAGRAM("Instagram"),
    LINKEDIN("LinkedIn"),
    TWITTER_X("X (Twitter)"),
    FACEBOOK("Facebook"),
    BLOG("Blog"),
    GENERAL("General");

    private final String displayName;

    Platform(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
