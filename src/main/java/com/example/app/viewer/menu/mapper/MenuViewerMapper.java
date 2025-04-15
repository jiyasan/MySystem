package com.example.app.viewer.menu.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.viewer.menu.dto.MenuViewerItemDTO;
import com.example.app.viewer.menu.dto.MenuViewerSubcategoryDTO;

@Mapper
public interface MenuViewerMapper {

    /**
     * 指定されたカテゴリIDに紐づく中分類一覧を取得
     */
    List<MenuViewerSubcategoryDTO> findSubcategoriesByCategoryId(@Param("categoryId") int categoryId);

    /**
     * 表示対象となるメニュー商品一覧を取得
     */
    List<MenuViewerItemDTO> findVisibleMenuItemsByCategoryId(@Param("categoryId") int categoryId);
}
