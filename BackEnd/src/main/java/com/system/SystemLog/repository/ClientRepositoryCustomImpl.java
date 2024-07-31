package com.system.SystemLog.repository;

import com.system.SystemLog.entity.Client;
import com.system.SystemLog.entity.FilterCriteria;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;


//@Repository
//public class ClientRepositoryCustomImpl implements ClientRepositoryCustom {
//
//
//    @PersistenceContext
//    private EntityManager entityManager;
//
//    @Override
//    public List<Client> findByMultipleCriteria(List<FilterCriteria> filters) {
//        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
//        CriteriaQuery<Client> query = cb.createQuery(Client.class);
//        Root<Client> root = query.from(Client.class);
//        Predicate predicate = cb.conjunction();
//
//        for (FilterCriteria filter : filters) {
//            String column = filter.getColumn();
//            String operator = filter.getOperator();
//            String data = filter.getData();
//
//            if (column != null && operator != null && data != null) {
//                switch (operator) {
//                    case "contains":
//                        predicate = cb.and(predicate, cb.like(cb.lower(root.get(column)), "%" + data.toLowerCase() + "%"));
//                        break;
//                    case "starts with":
//                        predicate = cb.and(predicate, cb.like(cb.lower(root.get(column)), data.toLowerCase() + "%"));
//                        break;
//                    case "ends with":
//                        predicate = cb.and(predicate, cb.like(cb.lower(root.get(column)), "%" + data.toLowerCase()));
//                        break;
//                    default:
//                        throw new IllegalArgumentException("Operator không hợp lệ: " + operator);
//                }
//            }
//        }
//
//        query.where(predicate);
//        return entityManager.createQuery(query).getResultList();
//    }
//}

@Repository
public class ClientRepositoryCustomImpl implements ClientRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Client> findByMultipleCriteria(List<FilterCriteria> filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Client> query = cb.createQuery(Client.class);
        Root<Client> root = query.from(Client.class);
        Predicate predicate = cb.conjunction();

        for (FilterCriteria filter : filters) {
            String column = filter.getColumn();
            String operator = filter.getOperator();
            String data = filter.getData();

            if (column != null && operator != null && data != null) {
                if ("birthdate".equals(column)) {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    LocalDate date = LocalDate.parse(data, formatter);

                    switch (operator) {
                        case "contains":
                            predicate = cb.and(predicate, cb.between(root.get(column), date.atStartOfDay(), date.plusDays(1).atStartOfDay()));
                            break;
                        case "starts with":
                            predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get(column), date.atStartOfDay()));
                            break;
                        case "ends with":
                            predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get(column), date.atStartOfDay()));
                            break;
                        default:
                            throw new IllegalArgumentException("Operator không hợp lệ: " + operator);
                    }
                }
                else if ("postalCode".equals(column)) {
                    String postalCode = data;
                    switch (operator) {
                        case "contains":
                            predicate = cb.and(predicate, cb.like(cb.toString(root.get(column)), "%" + postalCode + "%"));
                            break;
                        case "starts with":
                            predicate = cb.and(predicate, cb.like(cb.toString(root.get(column)), postalCode + "%"));
                            break;
                        case "ends with":
                            predicate = cb.and(predicate, cb.like(cb.toString(root.get(column)), "%" + postalCode));
                            break;
                        default:
                            throw new IllegalArgumentException("Operator không hợp lệ: " + operator);
                    }
                }
                else if ("status".equals(column)) {
                    Boolean status = "Active".equalsIgnoreCase(data); // Chuyển đổi chuỗi thành boolean
                    predicate = cb.and(predicate, cb.equal(root.get(column), status));
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