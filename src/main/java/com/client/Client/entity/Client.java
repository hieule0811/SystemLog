package com.client.Client.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "client")
public class Client {

    @Id
    @Column(name = "code", nullable = false, length = 15)
    @Size(min = 4, message = "Code must be at least 4 characters")
    @NotBlank
    private String code;
    @Column(name = "name", nullable = false, length = 50)
    private String name;
    @Column(name = "country", nullable = false, length = 20)
    private String country;
    @Column(name = "city", nullable = false, length = 20)
    private String city;
    @Column(name = "unloco", nullable = false, length = 20)
    private String unloco;
    @Column(name = "office_address", nullable = false, length = 256)
    private String office_address;
    @Column(name = "suburb", nullable = false, length = 20)
    private String suburb;
    @Column(name = "state", nullable = false, length = 20)
    private String state;
    @Column(name = "postal_code", nullable = false)
    private int postal_code;
    @Column(name = "email", length = 30)
    private String email;
    @Column(name = "status", nullable = false)
    private boolean status;

    // Getters and Setters

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getUnloco() {
        return unloco;
    }

    public void setUnloco(String unloco) {
        this.unloco = unloco;
    }

    public String getOffice_address() {
        return office_address;
    }

    public void setOffice_address(String office_address) {
        this.office_address = office_address;
    }

    public String getSuburb() {
        return suburb;
    }

    public void setSuburb(String suburb) {
        this.suburb = suburb;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getPostal_code() {
        return postal_code;
    }

    public void setPostal_code(int postal_code) {
        this.postal_code = postal_code;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
    // in Json
    @Override
    public String toString() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{}";
        }
    }
}
