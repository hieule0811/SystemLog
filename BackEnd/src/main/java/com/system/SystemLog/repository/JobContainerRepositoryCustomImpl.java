package com.system.SystemLog.repository;

import com.system.SystemLog.entity.FilterCriteria;
import com.system.SystemLog.entity.JobContainer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;



@Repository
public class JobContainerRepositoryCustomImpl implements JobContainerRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<JobContainer> findByMultipleCriteria(List<FilterCriteria> filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<JobContainer> query = cb.createQuery(JobContainer.class);
        Root<JobContainer> root = query.from(JobContainer.class);
        Predicate predicate = cb.conjunction();

        for (FilterCriteria filter : filters) {
            String column = filter.getColumn();
            String operator = filter.getOperator();
            String data = filter.getData();

            if (column != null && operator != null && data != null) {
                if ("tare".equals(column) || "net".equals(column) || "grossWeight".equals(column) || "level1Kg".equals(column) || "level2Kg".equals(column)|| "standardKg".equals(column)) {
                    String keyword = data;
                    switch (operator) {
                        case "contains":
                            predicate = cb.and(predicate, cb.like(cb.toString(root.get(column)), "%" + keyword + "%"));
                            break;
                        case "starts with":
                            predicate = cb.and(predicate, cb.like(cb.toString(root.get(column)), keyword + "%"));
                            break;
                        case "ends with":
                            predicate = cb.and(predicate, cb.like(cb.toString(root.get(column)), "%" + keyword));
                            break;
                        default:
                            throw new IllegalArgumentException("Operator không hợp lệ: " + operator);
                    }
                }
                else if ("status".equals(column)) {
                    Boolean status = "Active".equalsIgnoreCase(data);
                    predicate = cb.and(predicate, cb.equal(root.get(column), status));
                }
                else if("isEmpty".equals(column) || "isFull".equals(column)||"isOverweightLevel1".equals(column)||"isOverweightLevel2".equals(column)){
                    Boolean keyword = "Yes".equalsIgnoreCase(data);
                    predicate = cb.and(predicate, cb.equal(root.get(column), keyword));
                }
                else {
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
        }

        query.where(predicate);
        return entityManager.createQuery(query).getResultList();
    }
}