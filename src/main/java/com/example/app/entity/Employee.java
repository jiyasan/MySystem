package com.example.app.entity;

import java.sql.Date;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Employee {
    private Integer employeeId;
    private String loginId;
    private String password;         // ← loginPass → password に変更！
    private Integer shopId;
    private Integer position;
    private String stuffName;        // ← employeeName → stuffName に変更！
    private Date birthday;           // 任意で追加してもOK
    private Boolean enrollmentStatus; // 任意で追加
    private LocalDateTime createdAt; // 任意で追加
}

