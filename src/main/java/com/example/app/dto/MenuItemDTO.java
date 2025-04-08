package com.example.app.dto;

public class MenuItemDTO {

	private Integer menuItemId;
	private String itemName;
	private Integer price;
	private Boolean isVisible;
	private Boolean isOrderable;
	// 他に必要なら detail や stockQuantity なども

	public Integer getMenuItemId() {
		return menuItemId;
	}

	public void setMenuItemId(Integer menuItemId) {
		this.menuItemId = menuItemId;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Boolean getIsVisible() {
		return isVisible;
	}

	public void setIsVisible(Boolean isVisible) {
		this.isVisible = isVisible;
	}

	public Boolean getIsOrderable() {
		return isOrderable;
	}

	public void setIsOrderable(Boolean isOrderable) {
		this.isOrderable = isOrderable;
	}

}
