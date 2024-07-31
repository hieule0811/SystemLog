package com.system.SystemLog.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "tentk", unique = true, nullable = false)
    private String tentk;

    @Column(name = "matkhau", nullable = false)
    private String matkhau;

    @Column(name = "phonenumber", nullable = false)
    private String phonenumber;

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTentk() { return tentk; }
    public void setTentk(String tentk) { this.tentk = tentk; }
    public String getMatkhau() { return matkhau; }
    public void setMatkhau(String matkhau) { this.matkhau = matkhau; }
    public String getPhonenumber() { return phonenumber; }
    public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }
}