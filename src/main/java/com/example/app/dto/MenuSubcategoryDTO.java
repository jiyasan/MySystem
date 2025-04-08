package com.example.app.dto;

import java.util.List;

public class MenuSubcategoryDTO {

	private Integer subcategoryId;
	private String subcategoryName;
	private List<MenuItemDTO> items;

	public Integer getSubcategoryId() {
		return subcategoryId;
	}

	public void setSubcategoryId(Integer subcategoryId) {
		this.subcategoryId = subcategoryId;
	}

	public String getSubcategoryName() {
		return subcategoryName;
	}

	public void setSubcategoryName(String subcategoryName) {
		this.subcategoryName = subcategoryName;
	}

	public List<MenuItemDTO> getItems() {
		return items;
	}

	public void setItems(List<MenuItemDTO> items) {
		this.items = items;
	}

}
