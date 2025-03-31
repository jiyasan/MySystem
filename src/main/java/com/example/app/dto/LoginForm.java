package com.example.app.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginForm {

    @NotBlank(message = "ログインIDを入力してください")
    private String loginId;

    @NotBlank(message = "パスワードを入力してください")
    private String loginPass;

    // --- Getter / Setter ---

    public String getLoginId() {
        return loginId;
    }

    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }

    public String getLoginPass() {
        return loginPass;
    }

    public void setLoginPass(String loginPass) {
        this.loginPass = loginPass;
    }
}
