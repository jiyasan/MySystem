package com.example.app.viewer.menu;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.viewer.menu.dto.MenuViewerResponseDTO;

@RestController
@RequestMapping("/api/menu")
public class MenuViewerController {

	private final MenuViewerService menuViewerService;

	public MenuViewerController(MenuViewerService menuViewerService) {
		this.menuViewerService = menuViewerService;
	}

	/**
	 * カテゴリIDに対応する中分類・商品一覧を取得するAPI
	 * @param categoryId メニュー大分類ID
	 * @return MenuViewerResponseDTO (中分類リスト + 商品リスト)
	 */
	@GetMapping("/category/{categoryId}")
	public ResponseEntity<MenuViewerResponseDTO> getMenuByCategoryId(@PathVariable int categoryId) {
		MenuViewerResponseDTO response = menuViewerService.getMenuByCategoryId(categoryId);
		return ResponseEntity.ok(response);
	}
}
