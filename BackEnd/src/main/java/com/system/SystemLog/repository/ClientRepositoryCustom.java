package com.system.SystemLog.repository;

import com.system.SystemLog.entity.Client;
import com.system.SystemLog.entity.FilterCriteria;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepositoryCustom {
    List<Client> findByMultipleCriteria(List<FilterCriteria> filters);
}
