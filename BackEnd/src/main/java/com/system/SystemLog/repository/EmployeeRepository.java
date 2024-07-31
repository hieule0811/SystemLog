package com.system.SystemLog.repository;

import com.system.SystemLog.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByEmailAndMatkhau(String email, String matkhau);
    Employee findByEmail(String email);
    Employee findByTentk(String tentk);
}