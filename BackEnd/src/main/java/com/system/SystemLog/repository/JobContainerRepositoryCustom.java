package com.system.SystemLog.repository;

import com.system.SystemLog.entity.Client;
import com.system.SystemLog.entity.FilterCriteria;
import com.system.SystemLog.entity.JobContainer;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobContainerRepositoryCustom {
    List<JobContainer> findByMultipleCriteria(List<FilterCriteria> filters);
}
