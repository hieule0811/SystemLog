package com.system.SystemLog.dto;

public class SignUpResponse {
    private String email;
    private String tentk;
    private String matkhau;
    private String phonenumber;

    public SignUpResponse() {
        email = "";
        tentk = "";
        matkhau = "";
        phonenumber = "";
    }

    public SignUpResponse (String e, String t, String m, String p) {
        email = e;
        tentk = t;
        matkhau = m;
        phonenumber = p;
    }

    public String getTentk() { return tentk; }
    public void setTentk(String tentk) { this.tentk = tentk; }
    public String getMatkhau() { return matkhau; }
    public void setMatkhau(String matkhau) { this.matkhau = matkhau; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhonenumber() { return phonenumber; }
    public void setPhonenumber(String phonenumber) { this.phonenumber = phonenumber; }
}