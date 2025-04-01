package com.example.app.service;

import java.util.List;

import com.example.app.entity.Shop;

public interface ShopService {
	
	void updateShop(Shop shop);
	
	List<Shop> findAll();

	Shop findById(int shopId);

	int countByShopName(String shopName); // ← 追加！

	void insertShop(Shop shop); // ← 追加！

	boolean isShopNameDuplicate(String shopName);

	void addShop(String shopName);

}
