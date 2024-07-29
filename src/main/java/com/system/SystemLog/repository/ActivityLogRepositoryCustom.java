package com.system.SystemLog.repository;

import com.system.SystemLog.entity.ActivityLog;
import com.system.SystemLog.entity.FilterCriteria;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepositoryCustom {
    List<ActivityLog> findByMultipleCriteria(List<FilterCriteria> filters);
}
