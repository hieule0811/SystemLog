package com.system.SystemLog.controller;

import com.system.SystemLog.dto.LoginRequest;
import com.system.SystemLog.dto.LoginResponse;
import com.system.SystemLog.dto.SignUpRequest;
import com.system.SystemLog.entity.Employee;
import com.system.SystemLog.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Employee employee = employeeService.authenticate(loginRequest.getEmail(), loginRequest.getMatkhau());
        if (employee != null) {
            LoginResponse response = new LoginResponse(employee.getEmail(), employee.getTentk(), employee.getMatkhau());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignUpRequest signUpRequest) {
        try {
            if (employeeService.findByTentk(signUpRequest.getTentk()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
            }
            if (employeeService.findByEmail(signUpRequest.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            }
            employeeService.register(signUpRequest.getEmail(), signUpRequest.getTentk(), signUpRequest.getMatkhau(), signUpRequest.getPhonenumber());
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // Email already exists
        }
    }
}