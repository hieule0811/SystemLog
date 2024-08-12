package com.system.SystemLog.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_container")
public class JobContainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "created_by", nullable = false, length = 255)
    private String createdBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by", length = 255)
    private String updatedBy;

    @Column(name = "status", nullable = false)
    private Boolean status;

    @Column(name = "container_number", nullable = false, unique = true, length = 255)
    private String containerNumber;

    @Column(name = "seal_number", length = 255)
    private String sealNumber;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "tare", precision = 10, scale = 2)
    private BigDecimal tare;

    @Column(name = "net", precision = 10, scale = 2)
    private BigDecimal net;

    @Column(name = "gross_weight", precision = 10, scale = 2)
    private BigDecimal grossWeight;

    @Column(name = "is_empty")
    private Boolean isEmpty;

    @Column(name = "is_full")
    private Boolean isFull;

    @Column(name = "container_invoice_status", length = 255)
    private String containerInvoiceStatus;

    @Column(name = "is_overweight_level1")
    private Boolean isOverweightLevel1;

    @Column(name = "is_overweight_level2")
    private Boolean isOverweightLevel2;

    @Column(name = "level1_kg", precision = 10, scale = 2)
    private BigDecimal level1Kg;

    @Column(name = "level2_kg", precision = 10, scale = 2)
    private BigDecimal level2Kg;

    @Column(name = "title_level1", length = 255)
    private String titleLevel1;

    @Column(name = "title_level2", length = 255)
    private String titleLevel2;

    @Column(name = "standard_kg", precision = 10, scale = 2)
    private BigDecimal standardKg;

    // Getters and Setters

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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getContainerNumber() {
        return containerNumber;
    }

    public void setContainerNumber(String containerNumber) {
        this.containerNumber = containerNumber;
    }

    public String getSealNumber() {
        return sealNumber;
    }

    public void setSealNumber(String sealNumber) {
        this.sealNumber = sealNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getTare() {
        return tare;
    }

    public void setTare(BigDecimal tare) {
        this.tare = tare;
    }

    public BigDecimal getNet() {
        return net;
    }

    public void setNet(BigDecimal net) {
        this.net = net;
    }

    public BigDecimal getGrossWeight() {
        return grossWeight;
    }

    public void setGrossWeight(BigDecimal grossWeight) {
        this.grossWeight = grossWeight;
    }

    public Boolean getIsEmpty() {
        return isEmpty;
    }

    public void setIsEmpty(Boolean isEmpty) {
        this.isEmpty = isEmpty;
    }

    public Boolean getIsFull() {
        return isFull;
    }

    public void setIsFull(Boolean isFull) {
        this.isFull = isFull;
    }

    public String getContainerInvoiceStatus() {
        return containerInvoiceStatus;
    }

    public void setContainerInvoiceStatus(String containerInvoiceStatus) {
        this.containerInvoiceStatus = containerInvoiceStatus;
    }

    public Boolean getIsOverweightLevel1() {
        return isOverweightLevel1;
    }

    public void setIsOverweightLevel1(Boolean isOverweightLevel1) {
        this.isOverweightLevel1 = isOverweightLevel1;
    }

    public Boolean getIsOverweightLevel2() {
        return isOverweightLevel2;
    }

    public void setIsOverweightLevel2(Boolean isOverweightLevel2) {
        this.isOverweightLevel2 = isOverweightLevel2;
    }

    public BigDecimal getLevel1Kg() {
        return level1Kg;
    }

    public void setLevel1Kg(BigDecimal level1Kg) {
        this.level1Kg = level1Kg;
    }

    public BigDecimal getLevel2Kg() {
        return level2Kg;
    }

    public void setLevel2Kg(BigDecimal level2Kg) {
        this.level2Kg = level2Kg;
    }

    public String getTitleLevel1() {
        return titleLevel1;
    }

    public void setTitleLevel1(String titleLevel1) {
        this.titleLevel1 = titleLevel1;
    }

    public String getTitleLevel2() {
        return titleLevel2;
    }

    public void setTitleLevel2(String titleLevel2) {
        this.titleLevel2 = titleLevel2;
    }

    public BigDecimal getStandardKg() {
        return standardKg;
    }

    public void setStandardKg(BigDecimal standardKg) {
        this.standardKg = standardKg;
    }
}
