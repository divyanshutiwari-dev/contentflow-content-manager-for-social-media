package com.contentflow.dto;

public class WeeklyActivityDto {
    private String day;
    private String date;
    private long total;
    private long scheduled;
    private long published;
    private long drafts;

    public WeeklyActivityDto() {
    }

    public WeeklyActivityDto(String day, String date, long total, long scheduled, long published, long drafts) {
        this.day = day;
        this.date = date;
        this.total = total;
        this.scheduled = scheduled;
        this.published = published;
        this.drafts = drafts;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getScheduled() {
        return scheduled;
    }

    public void setScheduled(long scheduled) {
        this.scheduled = scheduled;
    }

    public long getPublished() {
        return published;
    }

    public void setPublished(long published) {
        this.published = published;
    }

    public long getDrafts() {
        return drafts;
    }

    public void setDrafts(long drafts) {
        this.drafts = drafts;
    }
}
