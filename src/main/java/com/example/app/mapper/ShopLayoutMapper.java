package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.app.dto.LayoutItem;

@Mapper
public interface ShopLayoutMapper {
	void deleteByShopId(int shopId);

	void insert(int shopId, LayoutItem item);

	List<LayoutItem> findByShopId(int shopId); // index表示用
}
