package com.example.app.entity;

import lombok.Data;

@Data
public class MenuSubcategory {
    private Integer subcategoryId;
    private Integer categoryId; // ←これが必要！
    private String subcategoryName;
    private Integer shopId;

}