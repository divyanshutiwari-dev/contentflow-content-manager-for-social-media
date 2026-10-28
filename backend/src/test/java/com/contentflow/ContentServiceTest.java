package com.contentflow;

import com.contentflow.dto.ContentRequestDto;
import com.contentflow.dto.ContentResponseDto;
import com.contentflow.dto.DashboardStatsDto;
import com.contentflow.exception.BadRequestException;
import com.contentflow.exception.ResourceNotFoundException;
import com.contentflow.model.Content;
import com.contentflow.model.ContentStatus;
import com.contentflow.model.ContentType;
import com.contentflow.model.Platform;
import com.contentflow.repository.ContentRepository;
import com.contentflow.service.ContentService;
import com.contentflow.service.ContentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContentServiceTest {

    @Mock
    private ContentRepository contentRepository;

    @InjectMocks
    private ContentServiceImpl contentService;

    private Content sampleContent;

    @BeforeEach
    void setUp() {
        sampleContent = new Content();
        sampleContent.setId(1L);
        sampleContent.setTitle("Test Title");
        sampleContent.setBody("Test Body for Social Post");
        sampleContent.setContentType(ContentType.SOCIAL_POST);
        sampleContent.setPlatform(Platform.LINKEDIN);
        sampleContent.setStatus(ContentStatus.DRAFT);
        sampleContent.setScheduledAt(null);
        sampleContent.setTags("test,marketing");
        sampleContent.setAuthor("Tester");
        sampleContent.setCreatedAt(LocalDateTime.now());
        sampleContent.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should retrieve content by ID successfully")
    void testGetContentByIdSuccess() {
        when(contentRepository.findById(1L)).thenReturn(Optional.of(sampleContent));

        ContentResponseDto result = contentService.getContentById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Title", result.getTitle());
        assertEquals(Platform.LINKEDIN, result.getPlatform());
        verify(contentRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when content ID is missing")
    void testGetContentByIdNotFound() {
        when(contentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> contentService.getContentById(99L));
        verify(contentRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("Should create draft content successfully")
    void testCreateDraftSuccess() {
        ContentRequestDto requestDto = new ContentRequestDto(
                "New Post", "Post body content", ContentType.SOCIAL_POST,
                Platform.TWITTER_X, ContentStatus.DRAFT, null, "saas", "Author"
        );

        when(contentRepository.save(any(Content.class))).thenAnswer(invocation -> {
            Content c = invocation.getArgument(0);
            c.setId(2L);
            c.setCreatedAt(LocalDateTime.now());
            c.setUpdatedAt(LocalDateTime.now());
            return c;
        });

        ContentResponseDto created = contentService.createContent(requestDto);

        assertNotNull(created);
        assertEquals("New Post", created.getTitle());
        assertEquals(ContentStatus.DRAFT, created.getStatus());
        verify(contentRepository, times(1)).save(any(Content.class));
    }

    @Test
    @DisplayName("Should reject scheduling content if date is in the past")
    void testCreateScheduledContentInPastThrowsError() {
        ContentRequestDto requestDto = new ContentRequestDto(
                "Past Post", "Body", ContentType.SOCIAL_POST,
                Platform.TWITTER_X, ContentStatus.SCHEDULED,
                LocalDateTime.now().minusHours(2), "saas", "Author"
        );

        assertThrows(BadRequestException.class, () -> contentService.createContent(requestDto));
        verify(contentRepository, never()).save(any(Content.class));
    }

    @Test
    @DisplayName("Should reject scheduling content if date is missing")
    void testCreateScheduledContentNullDateThrowsError() {
        ContentRequestDto requestDto = new ContentRequestDto(
                "No Date Post", "Body", ContentType.SOCIAL_POST,
                Platform.TWITTER_X, ContentStatus.SCHEDULED,
                null, "saas", "Author"
        );

        assertThrows(BadRequestException.class, () -> contentService.createContent(requestDto));
        verify(contentRepository, never()).save(any(Content.class));
    }

    @Test
    @DisplayName("Should duplicate content as a new draft")
    void testDuplicateContent() {
        when(contentRepository.findById(1L)).thenReturn(Optional.of(sampleContent));
        when(contentRepository.save(any(Content.class))).thenAnswer(invocation -> {
            Content c = invocation.getArgument(0);
            c.setId(10L);
            return c;
        });

        ContentResponseDto duplicated = contentService.duplicateContent(1L);

        assertNotNull(duplicated);
        assertEquals(10L, duplicated.getId());
        assertEquals("Copy of Test Title", duplicated.getTitle());
        assertEquals(ContentStatus.DRAFT, duplicated.getStatus());
        assertNull(duplicated.getScheduledAt());
        verify(contentRepository, times(1)).save(any(Content.class));
    }

    @Test
    @DisplayName("Should calculate dashboard stats from repository counts")
    void testGetDashboardStats() {
        when(contentRepository.count()).thenReturn(10L);
        when(contentRepository.countByStatus(ContentStatus.DRAFT)).thenReturn(4L);
        when(contentRepository.countByStatus(ContentStatus.SCHEDULED)).thenReturn(3L);
        when(contentRepository.countByStatus(ContentStatus.PUBLISHED)).thenReturn(3L);
        when(contentRepository.countByStatus(ContentStatus.ARCHIVED)).thenReturn(0L);
        when(contentRepository.findTop10ByStatusAndScheduledAtAfterOrderByScheduledAtAsc(any(), any()))
                .thenReturn(List.of());
        when(contentRepository.findTop10ByOrderByUpdatedAtDesc())
                .thenReturn(List.of(sampleContent));
        when(contentRepository.findAll()).thenReturn(List.of(sampleContent));

        DashboardStatsDto stats = contentService.getDashboardStats();

        assertNotNull(stats);
        assertEquals(10L, stats.getTotalContent());
        assertEquals(4L, stats.getDraftsCount());
        assertEquals(3L, stats.getScheduledCount());
        assertEquals(3L, stats.getPublishedCount());
        assertNotNull(stats.getWeeklyOverview());
        assertEquals(7, stats.getWeeklyOverview().size());
    }
}
