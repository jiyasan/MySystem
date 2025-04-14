package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.dto.MenuItemDTO;
import com.example.app.entity.MenuCategory;
import com.example.app.entity.MenuItem;
import com.example.app.entity.MenuSubcategory;

@Mapper
public interface MenuMapper {

    // --- カテゴリー ---
    List<MenuCategory> findCategoriesByShopId(Integer shopId);
    MenuCategory findCategoryById(Integer categoryId);
    int insertCategory(MenuCategory category);
    int updateCategory(MenuCategory category);

    // --- サブカテゴリー ---
    List<MenuSubcategory> findSubcategoriesByShopId(Integer shopId);
    List<MenuSubcategory> findSubcategoriesByCategoryIdAndShopId(@Param("categoryId") Integer categoryId,
                                                                 @Param("shopId") Integer shopId);
    MenuSubcategory findSubcategoryById(Integer subcategoryId);
    int insertSubcategory(MenuSubcategory subcategory);
    int updateSubcategory(MenuSubcategory subcategory);

    // --- メニュー商品 ---
    List<MenuItem> findItemsByShopId(Integer shopId);
    List<MenuItem> findItemsBySubcategoryId(Integer subcategoryId);
    MenuItem findMenuItemById(Integer itemId);
    int insertMenuItem(MenuItem item);
    int updateMenuItem(MenuItem item);

    //メニュー表表示
    List<MenuCategory> findAllCategoriesByShopId(int shopId);
    List<MenuSubcategory> findAllSubcategoriesByShopId(int shopId);
    List<MenuItemDTO> findAllItemDTOsByShopId(int shopId);

}
