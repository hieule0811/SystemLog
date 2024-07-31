package com.system.SystemLog.dto;

public class LoginResponse {
    private String tentk;
    private String email;
    private String matkhau;

    public LoginResponse() {
        email = "";
        tentk = "";
        matkhau = "";
    }

    public LoginResponse (String e, String t, String m) {
        tentk = t;
        email = e;
        matkhau = m;
    }

    public String getTentk() { return tentk; }
    public void setTentk(String tentk) { this.tentk = tentk; }
    public String getMatkhau() { return matkhau; }
    public void setMatkhau(String matkhau) { this.matkhau = matkhau; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}