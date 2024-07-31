package com.system.SystemLog.service;

import com.system.SystemLog.entity.Employee;
import com.system.SystemLog.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee findByTentk(String tentk) {
        return employeeRepository.findByTentk(tentk);
    }
    public Employee findByEmail(String email) {
        return employeeRepository.findByTentk(email);
    }
    public Employee authenticate(String email, String matkhau) {
        return employeeRepository.findByEmailAndMatkhau(email, matkhau);
    }

    public Employee register(String email, String tentk, String matkhau, String phonenumber) {
        // Check if the email already exists
        if (employeeRepository.findByEmail(email) != null) {
            throw new RuntimeException("Email already exists");
        }

        Employee employee = new Employee();
        employee.setTentk(tentk);
        employee.setEmail(email);
        employee.setMatkhau(matkhau); // In a real application, hash the password before saving
        employee.setPhonenumber(phonenumber);
        return employeeRepository.save(employee);
    }
}