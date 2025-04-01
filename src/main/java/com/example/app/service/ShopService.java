package com.example.app.service;

import java.util.List;

import com.example.app.entity.Shop;

public interface ShopService {

	List<Shop> findAll();

	int countByShopName(String shopName); // ← 追加！

	void insertShop(Shop shop); // ← 追加！

	boolean isShopNameDuplicate(String shopName);

	void addShop(String shopName);

}
