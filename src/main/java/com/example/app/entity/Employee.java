package com.example.app.entity;

import lombok.Data;

@Data
public class Employee {
    private Integer employeeId;
    private String loginId;
    private String loginPass;
    private Integer shopId;
    private Integer position;
    private String employeeName; // 表示名など必要なら
}
