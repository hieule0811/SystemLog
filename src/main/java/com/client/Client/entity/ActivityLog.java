package com.client.Client.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_log")
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by", nullable = false, length = 15)
    private String createdBy;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", nullable = false, length = 15)
    private String updatedBy;

    @Column(name = "event_source", nullable = false, length = 30)
    private String eventSource;

    @Column(name = "source_code", length = 256)
    private String sourceCode;

    @Column(name = "event_type", nullable = false, length = 6)
    private String eventType;

    @Column(name = "changed_data",columnDefinition = "TEXT")
    private String changedData;

    @Column(name = "data_old",columnDefinition = "TEXT")
    private String dataOld;

    @Column(name = "data_new",columnDefinition = "TEXT")
    private String dataNew;

    //=======================================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getEventSource() {
        return eventSource;
    }

    public void setEventSource(String eventSource) {
        this.eventSource = eventSource;
    }

    public String getSourceCode() {
        return sourceCode;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getChangedData() {
        return changedData;
    }

    public void setChangedData(String changedData) {
        this.changedData = changedData;
    }

    public String getDataOld() {
        return dataOld;
    }

    public void setDataOld(String dataOld) {
        this.dataOld = dataOld;
    }

    public String getDataNew() {
        return dataNew;
    }

    public void setDataNew(String dataNew) {
        this.dataNew = dataNew;
    }
}
