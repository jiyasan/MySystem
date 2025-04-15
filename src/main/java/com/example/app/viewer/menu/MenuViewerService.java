package com.example.app.viewer.menu;

import com.example.app.viewer.menu.dto.MenuViewerResponseDTO;

public interface MenuViewerService {

	/**
	 * 指定されたカテゴリIDに対応する中分類＋商品一覧を返す
	 *
	 * @param categoryId メニュー大分類ID
	 * @return 中分類と商品を含んだレスポンスDTO
	 */
	MenuViewerResponseDTO getMenuByCategoryId(int categoryId);
}
