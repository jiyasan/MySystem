package com.example.app.entity;

import lombok.Data;

@Data
public class MenuSubcategory {
    private Integer subcategoryId;       // メニュー中分類ID
    private String subcategoryName;      // メニュー中分類名
    private Integer shopId;          // 所属店舗ID（共通は0）
}
