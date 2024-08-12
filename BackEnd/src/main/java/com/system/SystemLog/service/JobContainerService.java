package com.system.SystemLog.service;

import com.system.SystemLog.entity.Client;
import com.system.SystemLog.entity.FilterCriteria;
import com.system.SystemLog.entity.JobContainer;
import com.system.SystemLog.exception.GlobalExceptionHandler;
import com.system.SystemLog.repository.JobContainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobContainerService {
    @Autowired
    private JobContainerRepository jobContainerRepository;
    public List<JobContainer> getAllJobContainer(){
        return jobContainerRepository.findAll();
    }

    public JobContainer getJobContainerById(Long id) {
        return jobContainerRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.JobContainerNotFoundException("Job Container not found with id: " + id));
    }
    public JobContainer getJobContainerByNumber(String container_number) {
        return  jobContainerRepository.findByContainerNumber(container_number);
    }

    public List<JobContainer> searchJobContainer(String keyword) {
        return jobContainerRepository.searchByKeyword(keyword);
    }
    public JobContainer updateJobContainer(Long id, JobContainer updatedJobContainer) {
        JobContainer existingJobContainer = jobContainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("JobContainer not found with id: " + id));

//        existingJobContainer.setContainerNumber(updatedJobContainer.getContainerNumber());
        existingJobContainer.setDescription(updatedJobContainer.getDescription());
        existingJobContainer.setTare(updatedJobContainer.getTare());
        existingJobContainer.setNet(updatedJobContainer.getNet());
        existingJobContainer.setGrossWeight(updatedJobContainer.getGrossWeight());
        existingJobContainer.setIsEmpty(updatedJobContainer.getIsEmpty());
        existingJobContainer.setIsFull(updatedJobContainer.getIsFull());
        existingJobContainer.setContainerInvoiceStatus(updatedJobContainer.getContainerInvoiceStatus());
        existingJobContainer.setIsOverweightLevel1(updatedJobContainer.getIsOverweightLevel1());
        existingJobContainer.setIsOverweightLevel2(updatedJobContainer.getIsOverweightLevel2());
        existingJobContainer.setLevel1Kg(updatedJobContainer.getLevel1Kg());
        existingJobContainer.setLevel2Kg(updatedJobContainer.getLevel2Kg());
        existingJobContainer.setTitleLevel1(updatedJobContainer.getTitleLevel1());
        existingJobContainer.setTitleLevel2(updatedJobContainer.getTitleLevel2());
        existingJobContainer.setStandardKg(updatedJobContainer.getStandardKg());
        existingJobContainer.setUpdatedAt(LocalDateTime.now());
        existingJobContainer.setUpdatedBy(updatedJobContainer.getUpdatedBy());

        return jobContainerRepository.save(existingJobContainer);
    }
    public JobContainer updateJobContainerByNumber(String containerNumber, JobContainer updatedJobContainer) {
        JobContainer existingJobContainer = jobContainerRepository.findByContainerNumber(containerNumber);

        if (existingJobContainer == null) {
            throw new RuntimeException("JobContainer not found with container number: " + containerNumber);
        }
        existingJobContainer.setDescription(updatedJobContainer.getDescription());
        existingJobContainer.setTare(updatedJobContainer.getTare());
        existingJobContainer.setNet(updatedJobContainer.getNet());
        existingJobContainer.setGrossWeight(updatedJobContainer.getGrossWeight());
        existingJobContainer.setIsEmpty(updatedJobContainer.getIsEmpty());
        existingJobContainer.setIsFull(updatedJobContainer.getIsFull());
        existingJobContainer.setContainerInvoiceStatus(updatedJobContainer.getContainerInvoiceStatus());
        existingJobContainer.setIsOverweightLevel1(updatedJobContainer.getIsOverweightLevel1());
        existingJobContainer.setIsOverweightLevel2(updatedJobContainer.getIsOverweightLevel2());
        existingJobContainer.setLevel1Kg(updatedJobContainer.getLevel1Kg());
        existingJobContainer.setLevel2Kg(updatedJobContainer.getLevel2Kg());
        existingJobContainer.setTitleLevel1(updatedJobContainer.getTitleLevel1());
        existingJobContainer.setTitleLevel2(updatedJobContainer.getTitleLevel2());
        existingJobContainer.setStandardKg(updatedJobContainer.getStandardKg());
        existingJobContainer.setUpdatedAt(LocalDateTime.now());
        existingJobContainer.setUpdatedBy(updatedJobContainer.getUpdatedBy());

        return jobContainerRepository.save(existingJobContainer);
    }
    public JobContainer createJobContainer(JobContainer newJobContainer) {
        return jobContainerRepository.save(newJobContainer);
    }
    public void deleteJobContainer(Long jobContainerId, String updatedBy) {
        JobContainer existingJobContainer = jobContainerRepository.findById(jobContainerId)
                .orElseThrow(() -> new GlobalExceptionHandler.ClientNotFoundException("Job Container not found with id: " + jobContainerId));

        existingJobContainer.setUpdatedBy(updatedBy);
        jobContainerRepository.save(existingJobContainer);
        jobContainerRepository.delete(existingJobContainer);
    }

    public Long getJobContainerIdByNumber(String container_number) {
        JobContainer job_container = jobContainerRepository.findByContainerNumber(container_number);
        if (job_container != null) {
            return job_container.getId();
        } else {
            return null;
        }
    }
    public List<JobContainer> filterEntities(List<FilterCriteria> filters) {
        return jobContainerRepository.findByMultipleCriteria(filters);
    }
}
