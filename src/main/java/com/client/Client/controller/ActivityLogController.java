package com.client.Client.controller;


import com.client.Client.dto.request.ApiResponse;
import com.client.Client.entity.ActivityLog;
import com.client.Client.entity.Client;
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
    public ResponseEntity<ApiResponse<List<ActivityLog>>> searchActivityLogs(@PathVariable String keyword) {
        List<ActivityLog> logs = activityLogService.searchInAllColumns(keyword);
        if (logs.isEmpty()) {
            ApiResponse<List<ActivityLog>> apiResponse = new ApiResponse<>(false, "No logs found for the given keyword: " + keyword, null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
        }
        ApiResponse <List<ActivityLog>> apiResponse = new ApiResponse<>(true,"logs found for the given keyword: "+keyword ,logs);
        return ResponseEntity.ok(apiResponse);
    }


    // tìm kiếm log dựa vào event type
    @GetMapping("/eventType/{eventType}")
    public ResponseEntity<List<ActivityLog>> getLogsByEventType(@PathVariable String eventType) {
        String UpperCaseEventType = eventType.toUpperCase();
        List<ActivityLog> logs = activityLogService.getLogsByEventType(UpperCaseEventType);
        return ResponseEntity.ok(logs);
    }

    // lọc theo time
    @GetMapping("/filterByTime")
    public ResponseEntity <ApiResponse<List<ActivityLog>>> getLogsBetweenTime(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {

        List<ActivityLog> logs = activityLogService.getLogsBetweenTime(startTime, endTime);
        if (logs.isEmpty()) {
            ApiResponse<List<ActivityLog>> apiResponse = new ApiResponse<>(false, "No logs found between " + startTime + " and " + endTime, null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
        }
        ApiResponse <List<ActivityLog>> apiResponse = new ApiResponse<>(true,"logs found between " + startTime + " and " + endTime,logs);
        return ResponseEntity.ok(apiResponse);
    }

    //xóa theo khoảng time
    @DeleteMapping("/deleteByTime")
    public ResponseEntity<ApiResponse<String>> deleteLogsBetweenTime(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
            activityLogService.deleteByEventTimeBetween(startTime, endTime);
            ApiResponse <String> apiResponse = new ApiResponse<>(true,"Deleted logs between " + startTime + " and " + endTime,null);
        return ResponseEntity.ok(apiResponse);
    }
}