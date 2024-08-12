package com.system.SystemLog.controller;

import com.system.SystemLog.entity.FilterCriteria;
import com.system.SystemLog.entity.JobContainer;
import com.system.SystemLog.exception.GlobalExceptionHandler;
import com.system.SystemLog.service.JobContainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/job_container")
@CrossOrigin(origins = "http://localhost:3000")
public class JobContainerController {
    @Autowired
    private JobContainerService jobContainerService;

    @GetMapping()
    ResponseEntity<List<JobContainer>> getAllJobContainer(){
        List <JobContainer> job_container = jobContainerService.getAllJobContainer();
        return ResponseEntity.ok(job_container);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobContainer> getJobContainerById(@PathVariable("id") Long id) {
        JobContainer job_container = jobContainerService.getJobContainerById(id);
        return ResponseEntity.ok(job_container);
    }
    @GetMapping("/container_number")
    public ResponseEntity<JobContainer> getJobContainerByNumber(@RequestParam("container_number") String container_number){
        JobContainer job_container = jobContainerService.getJobContainerByNumber(container_number);
        return ResponseEntity.ok(job_container);
    }
    @GetMapping("/search")
    public ResponseEntity<List<JobContainer>> searchJobContainer(@RequestParam String keyword) {
        List<JobContainer> job_container = jobContainerService.searchJobContainer(keyword);
        return ResponseEntity.ok(job_container);
    }
    @PutMapping("/{id}")
    public ResponseEntity<JobContainer> updateJobContainer(@PathVariable Long id,@RequestBody JobContainer job_container){
        JobContainer updateJobContainer = jobContainerService.updateJobContainer(id,job_container);
        return ResponseEntity.ok(updateJobContainer);
    }
    @PutMapping("/container_number/{container_number}")
    public ResponseEntity<String> updateJobContainer(@PathVariable String container_number,@RequestBody JobContainer job_container){
        JobContainer updateJobContainer = jobContainerService.updateJobContainerByNumber(container_number,job_container);
        return ResponseEntity.ok("Updated job container successfully");
    }
    @PostMapping
    public ResponseEntity<String> createJobContainer(@RequestBody JobContainer job_container) {
        JobContainer newJobContainer = jobContainerService.createJobContainer(job_container);
        return ResponseEntity.ok("Created job container successfully");
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJobContainer(@PathVariable Long id,@RequestParam String updatedBy) {
        try {
            jobContainerService.deleteJobContainer(id, updatedBy);
            return ResponseEntity.ok("Job Container deleted successfully");
        } catch (GlobalExceptionHandler.JobContainerNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/id/{container_number}")
    public ResponseEntity<Long> getJobContainerIdByNumber(@PathVariable String container_number) {
        Long jobContainerId = jobContainerService.getJobContainerIdByNumber(container_number);
        if (jobContainerId != null) {
            return ResponseEntity.ok(jobContainerId);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/filter")
    public ResponseEntity<List<JobContainer>> filter(
            @RequestBody List<FilterCriteria> filters) {
        if (filters == null) {
            filters = new ArrayList<>();
        }
        List<JobContainer> result = jobContainerService.filterEntities(filters);
        return ResponseEntity.ok(result);
    }
}
