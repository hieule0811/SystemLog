package com.client.Client.controller;


import com.client.Client.entity.ActivityLog;
import com.client.Client.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/logs")
public class ActivityLogController {
    @Autowired
    private ActivityLogService activityLogService;

    // xuất toàn bộ bảng log
    @GetMapping()
    ResponseEntity<List<ActivityLog>> getActivityLogs() {
        List<ActivityLog> logs = activityLogService.getActivityLogs();
        return ResponseEntity.ok(logs);
    }
    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<ActivityLog>> searchActivityLogs(@PathVariable String keyword) {
        List<ActivityLog> logs = activityLogService.searchInAllColumns(keyword);
        if (logs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(logs);
        }
        return ResponseEntity.ok(logs);
    }

    // tìm kiếm log dựa vào event type
    @GetMapping("/eventType/{eventType}")
    ResponseEntity<List<ActivityLog>> getLogsByEventType(@PathVariable String eventType) {
        String UpperCaseEventType = eventType.toUpperCase();
        List<ActivityLog> logs = activityLogService.getLogsByEventType(UpperCaseEventType);
        return ResponseEntity.ok(logs);
    }

    // lọc theo time
    @GetMapping("/filterByTime")
    public ResponseEntity<List<ActivityLog>> getLogsBetweenTime(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {

        List<ActivityLog> logs = activityLogService.getLogsBetweenTime(startTime, endTime);
        return ResponseEntity.ok(logs);
    }

    //xóa theo khoảng time
    @DeleteMapping("/deleteByTime")
    public ResponseEntity<String> deleteLogsBetweenTime(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        activityLogService.deleteByEventTimeBetween(startTime, endTime);
        return ResponseEntity.ok("Deleted logs between " + startTime + " and " + endTime);
    }
}