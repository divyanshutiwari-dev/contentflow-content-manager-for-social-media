package com.contentflow.repository;

import com.contentflow.model.Content;
import com.contentflow.model.ContentStatus;
import com.contentflow.model.Platform;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long>, JpaSpecificationExecutor<Content> {

    long countByStatus(ContentStatus status);

    long countByPlatform(Platform platform);

    @Query("SELECT c FROM Content c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:platform IS NULL OR c.platform = :platform) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.body) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.tags) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Content> searchContents(@Param("keyword") String keyword,
                                 @Param("status") ContentStatus status,
                                 @Param("platform") Platform platform,
                                 Sort sort);

    List<Content> findTop10ByStatusAndScheduledAtAfterOrderByScheduledAtAsc(ContentStatus status, LocalDateTime now);

    List<Content> findByStatusAndScheduledAtBetweenOrderByScheduledAtAsc(ContentStatus status, LocalDateTime start, LocalDateTime end);

    List<Content> findByScheduledAtBetweenOrderByScheduledAtAsc(LocalDateTime start, LocalDateTime end);

    List<Content> findTop10ByOrderByUpdatedAtDesc();

    List<Content> findAllByOrderByCreatedAtDesc();
}
