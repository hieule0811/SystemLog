package com.system.SystemLog.service;

import com.system.SystemLog.entity.ActivityLog;
import com.system.SystemLog.entity.Client;
import com.system.SystemLog.entity.FilterCriteria;
import com.system.SystemLog.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {
    @Autowired
    private ActivityLogRepository activityLogRepository;

    public List<ActivityLog> getAllActivityLogs() {
        return activityLogRepository.findAll();
    }
    public List<ActivityLog> searchActivityLogsByEventType(String eventType) {
        return activityLogRepository.findByEventType(eventType);
    }
    public List<ActivityLog> searchActivityLogs(String keyword) {
        return activityLogRepository.searchInAllColumns(keyword);
    }
    public List<ActivityLog> findActivityLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return activityLogRepository.findAllByEventTimeBetween(startDate, endDate);
    }
    public void deleteActivityLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        activityLogRepository.deleteByEventTimeBetween(startDate, endDate);
    }
    public void deleteAllActivityLogs() {
        activityLogRepository.deleteAll();
    }
    public List<ActivityLog> filterEntities(List<FilterCriteria> filters) {
        return activityLogRepository.findByMultipleCriteria(filters);
    }
}
