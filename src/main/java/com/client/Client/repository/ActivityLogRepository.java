package com.client.Client.repository;

import com.client.Client.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog,String> {
    List<ActivityLog> findByEventType(String eventType);
    List<ActivityLog> findByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime);
    void deleteByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime);
    @Query("SELECT a FROM ActivityLog a WHERE " +
            "LOWER(a.createdBy) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.updatedBy) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.eventSource) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.sourceCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.eventType) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.changedData) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.dataOld) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.dataNew) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ActivityLog> searchInAllColumns(@Param("keyword") String keyword);
}
