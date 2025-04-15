package com.example.app.viewer.menu.dto;

import java.util.List;

public class MenuViewerResponseDTO {
	private List<MenuViewerSubcategoryDTO> subcategories;
	private List<MenuViewerItemDTO> items;

	public MenuViewerResponseDTO() {
	}

	public MenuViewerResponseDTO(List<MenuViewerSubcategoryDTO> subcategories, List<MenuViewerItemDTO> items) {
		this.subcategories = subcategories;
		this.items = items;
	}

	public List<MenuViewerSubcategoryDTO> getSubcategories() {
		return subcategories;
	}

	public void setSubcategories(List<MenuViewerSubcategoryDTO> subcategories) {
		this.subcategories = subcategories;
	}

	public List<MenuViewerItemDTO> getItems() {
		return items;
	}

	public void setItems(List<MenuViewerItemDTO> items) {
		this.items = items;
	}
}
