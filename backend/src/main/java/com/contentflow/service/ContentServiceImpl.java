package com.contentflow.service;

import com.contentflow.dto.ContentRequestDto;
import com.contentflow.dto.ContentResponseDto;
import com.contentflow.dto.DashboardStatsDto;
import com.contentflow.dto.WeeklyActivityDto;
import com.contentflow.exception.BadRequestException;
import com.contentflow.exception.ResourceNotFoundException;
import com.contentflow.model.Content;
import com.contentflow.model.ContentStatus;
import com.contentflow.model.Platform;
import com.contentflow.repository.ContentRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContentServiceImpl implements ContentService {

    private final ContentRepository contentRepository;

    public ContentServiceImpl(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentResponseDto> getAllContents(String keyword, ContentStatus status, Platform platform, String sortBy, String sortDir) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String sortProperty = resolveSortProperty(sortBy);
        Sort sort = Sort.by(direction, sortProperty);

        List<Content> contents = contentRepository.searchContents(keyword, status, platform, sort);
        return contents.stream()
                .map(ContentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    private String resolveSortProperty(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return "createdAt";
        }
        return switch (sortBy.toLowerCase()) {
            case "scheduledat", "scheduled_at", "date" -> "scheduledAt";
            case "title" -> "title";
            case "status" -> "status";
            case "platform" -> "platform";
            case "updatedat", "updated_at" -> "updatedAt";
            default -> "createdAt";
        };
    }

    @Override
    @Transactional(readOnly = true)
    public ContentResponseDto getContentById(Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content item not found with ID: " + id));
        return ContentResponseDto.fromEntity(content);
    }

    @Override
    public ContentResponseDto createContent(ContentRequestDto requestDto) {
        validateScheduledContent(requestDto.getStatus(), requestDto.getScheduledAt(), null);

        Content content = new Content();
        mapDtoToEntity(requestDto, content);

        Content saved = contentRepository.save(content);
        return ContentResponseDto.fromEntity(saved);
    }

    @Override
    public ContentResponseDto updateContent(Long id, ContentRequestDto requestDto) {
        Content existing = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content item not found with ID: " + id));

        validateScheduledContent(requestDto.getStatus(), requestDto.getScheduledAt(), existing.getScheduledAt());

        mapDtoToEntity(requestDto, existing);
        Content updated = contentRepository.save(existing);
        return ContentResponseDto.fromEntity(updated);
    }

    @Override
    public void deleteContent(Long id) {
        if (!contentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: content item not found with ID: " + id);
        }
        contentRepository.deleteById(id);
    }

    @Override
    public ContentResponseDto duplicateContent(Long id) {
        Content original = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content item not found with ID: " + id));

        Content duplicate = new Content();
        duplicate.setTitle("Copy of " + original.getTitle());
        duplicate.setBody(original.getBody());
        duplicate.setContentType(original.getContentType());
        duplicate.setPlatform(original.getPlatform());
        duplicate.setStatus(ContentStatus.DRAFT);
        duplicate.setScheduledAt(null);
        duplicate.setTags(original.getTags());
        duplicate.setAuthor(original.getAuthor());

        Content saved = contentRepository.save(duplicate);
        return ContentResponseDto.fromEntity(saved);
    }

    @Override
    public ContentResponseDto updateStatus(Long id, ContentStatus newStatus) {
        Content existing = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content item not found with ID: " + id));

        if (newStatus == ContentStatus.SCHEDULED) {
            if (existing.getScheduledAt() == null || existing.getScheduledAt().isBefore(LocalDateTime.now())) {
                throw new BadRequestException("Cannot schedule content without a valid future scheduled date and time.");
            }
        } else if (newStatus == ContentStatus.DRAFT) {
            // moving to draft can keep or clear scheduled date
        }

        existing.setStatus(newStatus);
        Content updated = contentRepository.save(existing);
        return ContentResponseDto.fromEntity(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalContent(contentRepository.count());
        stats.setDraftsCount(contentRepository.countByStatus(ContentStatus.DRAFT));
        stats.setScheduledCount(contentRepository.countByStatus(ContentStatus.SCHEDULED));
        stats.setPublishedCount(contentRepository.countByStatus(ContentStatus.PUBLISHED));
        stats.setArchivedCount(contentRepository.countByStatus(ContentStatus.ARCHIVED));

        LocalDateTime now = LocalDateTime.now();
        List<Content> upcomingEntities = contentRepository.findTop10ByStatusAndScheduledAtAfterOrderByScheduledAtAsc(
                ContentStatus.SCHEDULED, now);
        List<ContentResponseDto> upcomingDtos = upcomingEntities.stream()
                .map(ContentResponseDto::fromEntity)
                .collect(Collectors.toList());
        stats.setUpcomingPosts(upcomingDtos);
        stats.setUpcomingCount(upcomingDtos.size());

        List<Content> recentEntities = contentRepository.findTop10ByOrderByUpdatedAtDesc();
        stats.setRecentlyUpdated(recentEntities.stream()
                .map(ContentResponseDto::fromEntity)
                .collect(Collectors.toList()));

        // Platform distribution
        Map<String, Long> platformMap = new LinkedHashMap<>();
        for (Platform p : Platform.values()) {
            long count = contentRepository.countByPlatform(p);
            platformMap.put(p.name(), count);
        }
        stats.setPlatformDistribution(platformMap);

        // Weekly activity: Monday to Sunday of the current week
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        List<WeeklyActivityDto> weekly = new ArrayList<>();
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEE");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<Content> allContents = contentRepository.findAll();

        for (int i = 0; i < 7; i++) {
            LocalDate currentDay = monday.plusDays(i);
            LocalDateTime dayStart = currentDay.atStartOfDay();
            LocalDateTime dayEnd = currentDay.atTime(LocalTime.MAX);

            long scheduledOnDay = allContents.stream()
                    .filter(c -> c.getStatus() == ContentStatus.SCHEDULED && c.getScheduledAt() != null)
                    .filter(c -> !c.getScheduledAt().isBefore(dayStart) && !c.getScheduledAt().isAfter(dayEnd))
                    .count();

            long publishedOnDay = allContents.stream()
                    .filter(c -> c.getStatus() == ContentStatus.PUBLISHED)
                    .filter(c -> (c.getUpdatedAt() != null && !c.getUpdatedAt().isBefore(dayStart) && !c.getUpdatedAt().isAfter(dayEnd))
                              || (c.getScheduledAt() != null && !c.getScheduledAt().isBefore(dayStart) && !c.getScheduledAt().isAfter(dayEnd)))
                    .count();

            long draftsOnDay = allContents.stream()
                    .filter(c -> c.getStatus() == ContentStatus.DRAFT)
                    .filter(c -> c.getCreatedAt() != null && !c.getCreatedAt().isBefore(dayStart) && !c.getCreatedAt().isAfter(dayEnd))
                    .count();

            long totalDay = scheduledOnDay + publishedOnDay + draftsOnDay;

            weekly.add(new WeeklyActivityDto(
                    currentDay.format(dayFormatter),
                    currentDay.format(dateFormatter),
                    totalDay,
                    scheduledOnDay,
                    publishedOnDay,
                    draftsOnDay
            ));
        }
        stats.setWeeklyOverview(weekly);

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentResponseDto> getCalendarEvents(Integer year, Integer month) {
        List<Content> contents;
        if (year != null && month != null) {
            YearMonth yearMonth = YearMonth.of(year, month);
            LocalDateTime start = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime end = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);
            contents = contentRepository.findByScheduledAtBetweenOrderByScheduledAtAsc(start, end);
        } else {
            // Return all items with scheduledAt set
            contents = contentRepository.findAll().stream()
                    .filter(c -> c.getScheduledAt() != null)
                    .sorted(Comparator.comparing(Content::getScheduledAt))
                    .collect(Collectors.toList());
        }

        return contents.stream()
                .map(ContentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateScheduledContent(ContentStatus status, LocalDateTime scheduledAt, LocalDateTime existingScheduledAt) {
        if (status == ContentStatus.SCHEDULED) {
            if (scheduledAt == null) {
                throw new BadRequestException("Scheduled date and time is required when status is set to Scheduled.");
            }
            // Allow if untouched and was already set, but for new / changed schedules require future date
            if (existingScheduledAt == null || !scheduledAt.equals(existingScheduledAt)) {
                if (scheduledAt.isBefore(LocalDateTime.now())) {
                    throw new BadRequestException("Scheduled date and time must be in the future.");
                }
            }
        }
    }

    private void mapDtoToEntity(ContentRequestDto dto, Content entity) {
        entity.setTitle(dto.getTitle().trim());
        entity.setBody(dto.getBody().trim());
        entity.setContentType(dto.getContentType());
        entity.setPlatform(dto.getPlatform());
        entity.setStatus(dto.getStatus());
        entity.setScheduledAt(dto.getScheduledAt());
        entity.setTags(dto.getTags() != null ? dto.getTags().trim() : null);
        if (dto.getAuthor() != null && !dto.getAuthor().isBlank()) {
            entity.setAuthor(dto.getAuthor().trim());
        }
    }
}
