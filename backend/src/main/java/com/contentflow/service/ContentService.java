package com.contentflow.service;

import com.contentflow.dto.ContentRequestDto;
import com.contentflow.dto.ContentResponseDto;
import com.contentflow.dto.DashboardStatsDto;
import com.contentflow.model.ContentStatus;
import com.contentflow.model.Platform;

import java.util.List;

public interface ContentService {

    List<ContentResponseDto> getAllContents(String keyword, ContentStatus status, Platform platform, String sortBy, String sortDir);

    ContentResponseDto getContentById(Long id);

    ContentResponseDto createContent(ContentRequestDto requestDto);

    ContentResponseDto updateContent(Long id, ContentRequestDto requestDto);

    void deleteContent(Long id);

    ContentResponseDto duplicateContent(Long id);

    ContentResponseDto updateStatus(Long id, ContentStatus newStatus);

    DashboardStatsDto getDashboardStats();

    List<ContentResponseDto> getCalendarEvents(Integer year, Integer month);
}
