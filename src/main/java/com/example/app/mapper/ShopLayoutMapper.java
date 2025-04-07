package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.dto.LayoutItem;

@Mapper
public interface ShopLayoutMapper {

	void insert(int shopId, LayoutItem item);

	// 使用中（is_deleted = false）
	List<LayoutItem> findByShopId(int shopId);

	// 非表示（is_deleted = true）
	List<LayoutItem> findHiddenByShopId(int shopId);


	void logicalDeleteByShopId(int shopId); // ← 論理削除に変更

	void deleteByShopId(int shopId);

	void upsert(@Param("shopId") int shopId, @Param("item") LayoutItem item); // ← 新しいupsert用

}
