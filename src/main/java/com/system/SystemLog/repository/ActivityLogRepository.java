package com.system.SystemLog.repository;

import com.system.SystemLog.entity.ActivityLog;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long>,ActivityLogRepositoryCustom  {
    List<ActivityLog> findByEventType(String eventType);
//    @Query("SELECT a FROM ActivityLog a WHERE " +
//            "LOWER(a.createdBy) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
//            "LOWER(a.eventSource) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
//            "LOWER(a.eventType) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
//            "LOWER(a.sourceCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
//            "LOWER(a.changedData) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
//            "LOWER(a.dataOld) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
//            "LOWER(a.dataNew) LIKE LOWER(CONCAT('%', :keyword, '%'))")

    @Query("SELECT a FROM ActivityLog a WHERE " +
            "TO_CHAR(a.eventTime, 'DD/MM/YYYY HH24:MI') LIKE (CONCAT('%', :keyword, '%')) OR " +
            "(a.createdBy) LIKE (CONCAT('%', :keyword, '%')) OR " +
            "(a.eventSource) LIKE (CONCAT('%', :keyword, '%')) OR " +
            "(a.eventType) LIKE (CONCAT('%', :keyword, '%')) OR " +
            "(a.sourceCode) LIKE (CONCAT('%', :keyword, '%')) OR " +
            "(a.changedData) LIKE (CONCAT('%', :keyword, '%')) OR " +
            "(a.dataOld) LIKE (CONCAT('%', :keyword, '%')) OR " +
            "(a.dataNew) LIKE (CONCAT('%', :keyword, '%'))")
    List<ActivityLog> searchInAllColumns(@Param("keyword") String keyword);

    @Query("SELECT a FROM ActivityLog a WHERE a.eventTime BETWEEN :startDate AND :endDate")
    List<ActivityLog> findAllByEventTimeBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Transactional
    void deleteByEventTimeBetween(LocalDateTime startDate, LocalDateTime endDate);

}
