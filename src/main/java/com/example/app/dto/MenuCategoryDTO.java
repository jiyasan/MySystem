package com.example.app.dto;

import java.util.List;

public class MenuCategoryDTO {

	private Integer categoryId;
	private String categoryName;
	private List<MenuSubcategoryDTO> subcategories;

	public Integer getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Integer categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public List<MenuSubcategoryDTO> getSubcategories() {
		return subcategories;
	}

	public void setSubcategories(List<MenuSubcategoryDTO> subcategories) {
		this.subcategories = subcategories;
	}

}
