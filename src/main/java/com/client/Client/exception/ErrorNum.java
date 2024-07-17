package com.client.Client.exception;

public enum ErrorNum {

    ;
    private  boolean success;
    private String message;

    ErrorNum(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
