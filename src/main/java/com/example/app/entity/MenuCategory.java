package com.example.app.entity;

import lombok.Data;

@Data
public class MenuCategory {
	private Integer categoryId; 	// メニュー大分類ID
	private String categoryName; 	// メニュー大分類名
	private Integer shopId; 		// 所属店舗ID（共通は0）
	private Boolean isFood; 		// フード区分（0 or 1）
}
