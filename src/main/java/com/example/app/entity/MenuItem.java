package com.example.app.entity;

import lombok.Data;

@Data
public class MenuItem {
    private Integer menuItemId;          // 商品ID
    private Integer itemCategory;        // 大分類ID (FK)
    private Integer itemSubcategory;     // 中分類ID (FK)
    private String itemName;             // 商品名
    private String itemDetail;           // 商品詳細
    private String itemImage;            // 画像パス or URL
    private Integer price;               // 価格
    private String note;                 // 備考（任意）
    private Boolean isVisible;           // 表示可否（非公開 = false）
    private Boolean isOrderable;        // 売り切れ状態（false = 売切）
    private Integer stockQuantity;       // 在庫数（null = ∞）
    private Integer shopId;              //店舗ID
}
