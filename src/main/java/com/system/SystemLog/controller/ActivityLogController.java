package com.system.SystemLog.controller;

import com.system.SystemLog.entity.ActivityLog;
import com.system.SystemLog.entity.FilterCriteria;
import com.system.SystemLog.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/logs")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityLogController {
    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getAllActivityLogs() {
        List<ActivityLog> logs = activityLogService.getAllActivityLogs();
        return ResponseEntity.ok(logs);
    }
    @GetMapping("/search/{eventType}")
    public ResponseEntity<List<ActivityLog>> searchActivityLogsByEventType(@PathVariable String eventType) {
        String UpperCaseEventType = eventType.toUpperCase();
        List<ActivityLog> logs = activityLogService.searchActivityLogsByEventType(UpperCaseEventType);
        return ResponseEntity.ok(logs);
    }
    @GetMapping("/search")
    public ResponseEntity<List<ActivityLog>> searchActivityLogs(@RequestParam String keyword) {
        List<ActivityLog> logs = activityLogService.searchActivityLogs(keyword);
        return ResponseEntity.ok(logs);
    }


    @GetMapping("/filterByDate")
    public ResponseEntity<List<ActivityLog>> filterActivityLogsByDate(
            @RequestParam("startDate") String startDateStr,
            @RequestParam("endDate") String endDateStr) {
        LocalDateTime startDate = LocalDateTime.parse(startDateStr);
        LocalDateTime endDate = LocalDateTime.parse(endDateStr);
        List<ActivityLog> logs = activityLogService.findActivityLogsByDateRange(startDate, endDate);
        return ResponseEntity.ok(logs);
    }

    @DeleteMapping("/deleteByDate")
    public ResponseEntity<String> deleteActivityLogsByDate(
            @RequestParam("startDate") String startDateStr,
            @RequestParam("endDate") String endDateStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime startDate = LocalDateTime.parse(startDateStr, formatter);
        LocalDateTime endDate = LocalDateTime.parse(endDateStr, formatter);
        activityLogService.deleteActivityLogsByDateRange(startDate, endDate);
        return ResponseEntity.ok("Deleted logs from " + startDate + " to " + endDate);
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<String> deleteAllActivityLogs() {
        activityLogService.deleteAllActivityLogs();
        return ResponseEntity.ok("Deleted all activity logs");
    }
    @PostMapping("/filter")
    public ResponseEntity<List<ActivityLog>> filter(
            @RequestBody List<FilterCriteria> filters) {
        System.out.println("Filters received: " + filters); // In ra dữ liệu để kiểm tra
        if (filters == null) {
            filters = new ArrayList<>();
        }
        List<ActivityLog> result = activityLogService.filterEntities(filters);
        return ResponseEntity.ok(result);
    }
}
