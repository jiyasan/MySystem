package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.app.entity.Shop;

@Mapper
public interface ShopMapper {
	
	void insertShop(Shop shop);

	List<Shop> findAll();

	Shop findById(int shopId);

	int countByShopName(String shopName);

	void updateShop(Shop shop);

}
