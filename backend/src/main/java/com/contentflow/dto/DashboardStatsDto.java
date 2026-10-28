package com.contentflow.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalContent;
    private long draftsCount;
    private long scheduledCount;
    private long publishedCount;
    private long archivedCount;
    private long upcomingCount;
    private List<ContentResponseDto> upcomingPosts;
    private List<ContentResponseDto> recentlyUpdated;
    private Map<String, Long> platformDistribution;
    private List<WeeklyActivityDto> weeklyOverview;

    public DashboardStatsDto() {
    }

    public long getTotalContent() {
        return totalContent;
    }

    public void setTotalContent(long totalContent) {
        this.totalContent = totalContent;
    }

    public long getDraftsCount() {
        return draftsCount;
    }

    public void setDraftsCount(long draftsCount) {
        this.draftsCount = draftsCount;
    }

    public long getScheduledCount() {
        return scheduledCount;
    }

    public void setScheduledCount(long scheduledCount) {
        this.scheduledCount = scheduledCount;
    }

    public long getPublishedCount() {
        return publishedCount;
    }

    public void setPublishedCount(long publishedCount) {
        this.publishedCount = publishedCount;
    }

    public long getArchivedCount() {
        return archivedCount;
    }

    public void setArchivedCount(long archivedCount) {
        this.archivedCount = archivedCount;
    }

    public long getUpcomingCount() {
        return upcomingCount;
    }

    public void setUpcomingCount(long upcomingCount) {
        this.upcomingCount = upcomingCount;
    }

    public List<ContentResponseDto> getUpcomingPosts() {
        return upcomingPosts;
    }

    public void setUpcomingPosts(List<ContentResponseDto> upcomingPosts) {
        this.upcomingPosts = upcomingPosts;
    }

    public List<ContentResponseDto> getRecentlyUpdated() {
        return recentlyUpdated;
    }

    public void setRecentlyUpdated(List<ContentResponseDto> recentlyUpdated) {
        this.recentlyUpdated = recentlyUpdated;
    }

    public Map<String, Long> getPlatformDistribution() {
        return platformDistribution;
    }

    public void setPlatformDistribution(Map<String, Long> platformDistribution) {
        this.platformDistribution = platformDistribution;
    }

    public List<WeeklyActivityDto> getWeeklyOverview() {
        return weeklyOverview;
    }

    public void setWeeklyOverview(List<WeeklyActivityDto> weeklyOverview) {
        this.weeklyOverview = weeklyOverview;
    }
}
