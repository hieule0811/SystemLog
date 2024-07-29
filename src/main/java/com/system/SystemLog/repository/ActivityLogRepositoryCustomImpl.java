package com.system.SystemLog.repository;

import com.system.SystemLog.entity.ActivityLog;
import com.system.SystemLog.entity.FilterCriteria;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;


import java.util.List;



@Repository
public class ActivityLogRepositoryCustomImpl implements ActivityLogRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<ActivityLog> findByMultipleCriteria(List<FilterCriteria> filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ActivityLog> query = cb.createQuery(ActivityLog.class);
        Root<ActivityLog> root = query.from(ActivityLog.class);
        Predicate predicate = cb.conjunction();

        for (FilterCriteria filter : filters) {
            String column = filter.getColumn();
            String operator = filter.getOperator();
            String data = filter.getData();

            if (column != null && operator != null && data != null) {
                switch (operator) {
                    case "contains":
                        predicate = cb.and(predicate, cb.like(cb.lower(root.get(column)), "%" + data.toLowerCase() + "%"));
                        break;
                    case "starts with":
                        predicate = cb.and(predicate, cb.like(cb.lower(root.get(column)), data.toLowerCase() + "%"));
                        break;
                    case "ends with":
                        predicate = cb.and(predicate, cb.like(cb.lower(root.get(column)), "%" + data.toLowerCase()));
                        break;
                    default:
                        throw new IllegalArgumentException("Operator không hợp lệ: " + operator);
                }

            }
        }
        query.where(predicate);
        return entityManager.createQuery(query).getResultList();
    }
}