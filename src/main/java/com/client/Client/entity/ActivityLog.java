package com.client.Client.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_log")
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "event_time", nullable = false)
    private LocalDateTime eventTime;

    @Column(name = "created_by", nullable = false, length = 15)
    private String createdBy;

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

    public LocalDateTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalDateTime eventTime) {
        this.eventTime = eventTime;
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
