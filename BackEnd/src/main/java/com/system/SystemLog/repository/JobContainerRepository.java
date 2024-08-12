package com.system.SystemLog.repository;

import com.system.SystemLog.entity.Client;
import com.system.SystemLog.entity.JobContainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobContainerRepository extends JpaRepository<JobContainer, Long>,JobContainerRepositoryCustom {

    @Query("SELECT jc FROM JobContainer jc WHERE " +
            "LOWER(jc.containerNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(jc.sealNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(jc.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CAST(jc.tare AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CAST(jc.net AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CAST(jc.grossWeight AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(jc.containerInvoiceStatus) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CAST(jc.level1Kg AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CAST(jc.level2Kg AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(jc.titleLevel1) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(jc.titleLevel2) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CAST(jc.standardKg AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR" +
            ":keyword = 'Active' AND jc.status = true OR " +
            ":keyword = 'Inactive' AND jc.status = false OR" +
            "(LOWER(:keyword) = 'yes' AND jc.isEmpty = true) OR " +
            "(LOWER(:keyword) = 'no' AND jc.isEmpty = false) OR" +
            "(LOWER(:keyword) = 'yes' AND jc.isFull = true) OR " +
            "(LOWER(:keyword) = 'no' AND jc.isFull = false) OR" +
            "(LOWER(:keyword) = 'yes' AND jc.isOverweightLevel1 = true) OR " +
            "(LOWER(:keyword) = 'no' AND jc.isOverweightLevel1 = false) OR" +
            "(LOWER(:keyword) = 'yes' AND jc.isOverweightLevel2 = true) OR " +
            "(LOWER(:keyword) = 'no' AND jc.isOverweightLevel2 =  false)"
    )
    List<JobContainer> searchByKeyword(@Param("keyword") String keyword);
    JobContainer findByContainerNumber(String container_number);
}
