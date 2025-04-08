package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.entity.MenuCategory;
import com.example.app.entity.MenuItem;
import com.example.app.entity.MenuSubcategory;

@Mapper
public interface MenuMapper {

	// --- カテゴリー ---
	List<MenuCategory> findCategoriesByShopId(Integer shopId);

	// --- サブカテゴリー ---
	List<MenuSubcategory> findSubcategoriesByCategoryIdAndShopId(@Param("categoryId") Integer categoryId, @Param("shopId") Integer shopId);
	List<MenuSubcategory> findSubcategoriesByShopId(Integer shopId);

	// --- メニュー商品 ---
	List<MenuItem> findItemsByShopId(Integer shopId);

    int insertMenuItem(MenuItem item);

}
