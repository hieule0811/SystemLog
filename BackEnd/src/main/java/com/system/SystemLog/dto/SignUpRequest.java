package com.system.SystemLog.dto;

public class SignUpRequest {
    private String tentk;
    private String email;
    private String matkhau;
    private String phonenumber;

    // Getters and setters
    public String getTentk() {
        return tentk;
    }

    public void setTenTk(String tenTk) {
        this.tentk = tenTk;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMatkhau() {
        return matkhau;
    }

    public void setMatkhau(String matkhau) {
        this.matkhau = matkhau;
    }

    public String getPhonenumber() {return phonenumber;}
    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }
}