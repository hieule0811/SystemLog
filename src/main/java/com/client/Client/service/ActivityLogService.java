package com.client.Client.service;

import com.client.Client.entity.ActivityLog;
import com.client.Client.repository.ActivityLogRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {
    @Autowired
    private ActivityLogRepository activityLogRepository;

    public void logDeleteAction(String editor, String dataOld) {
        ActivityLog log = new ActivityLog();

        log.setCreatedAt(LocalDateTime.now());
        log.setCreatedBy(editor);
        log.setEventSource("API");
        log.setEventType("DELETE");
        log.setSourceCode(editor);
        log.setChangedData(null);
        log.setDataOld(dataOld);
        log.setDataNew(null);
        activityLogRepository.save(log);
    }
    public List <ActivityLog> getActivityLogs(){
        return activityLogRepository.findAll();
    }

    // Lấy logs theo event_type
    public List<ActivityLog> getLogsByEventType(String eventType) {
        return activityLogRepository.findByEventType(eventType);
    }
    //lọc theo time
    public List<ActivityLog> getLogsBetweenTime(LocalDateTime startTime, LocalDateTime endTime) {
        return activityLogRepository.findByCreatedAtBetween(startTime, endTime);
    }
    //lọc theo từng chữ cái
    public List<ActivityLog> searchInAllColumns(String keyword) {
        return activityLogRepository.searchInAllColumns(keyword);
    }

    //xóa theo khoảng time
    @Transactional
    public void deleteByEventTimeBetween(LocalDateTime startTime, LocalDateTime endTime) {
        activityLogRepository.deleteByCreatedAtBetween(startTime, endTime);
    }

}
