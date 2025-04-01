package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.app.entity.MenuCategory;
import com.example.app.entity.MenuItem;
import com.example.app.entity.MenuSubcategory;

@Mapper
public interface MenuMapper {

    // --- カテゴリー ---
    List<MenuCategory> findAllCategories();

    // --- サブカテゴリー ---
    List<MenuSubcategory> findSubcategoriesByCategoryId(Integer categoryId);

    // --- メニュー商品 ---
    List<MenuItem> findItemsBySubcategoryId(Integer subcategoryId);

    int insertMenuItem(MenuItem item);

}
