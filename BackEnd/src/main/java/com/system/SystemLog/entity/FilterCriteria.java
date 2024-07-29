package com.system.SystemLog.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FilterCriteria {
    @JsonProperty("column")
    private String column;

    @JsonProperty("operator")
    private String operator;

    @JsonProperty("data")
    private String data;

    // Constructors
    public FilterCriteria() {}

    public FilterCriteria(String column, String operator, String data) {
        this.column = column;
        this.operator = operator;
        this.data = data;
    }

    // Getters and Setters
    public String getColumn() {
        return column;
    }

    public void setColumn(String column) {
        this.column = column;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
