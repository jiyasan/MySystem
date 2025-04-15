package com.example.app.viewer.menu.dto;

public class MenuViewerItemDTO {
	private int id;
	private String name;
	private String detail;
	private String image;
	private int price;
	private boolean isVisible;
	private boolean isOrderable;
	private int subcategoryId;

	public MenuViewerItemDTO() {
	}

	public MenuViewerItemDTO(int id, String name, String detail, String image,
			int price, boolean isVisible, boolean isOrderable, int subcategoryId) {
		this.id = id;
		this.name = name;
		this.detail = detail;
		this.image = image;
		this.price = price;
		this.isVisible = isVisible;
		this.isOrderable = isOrderable;
		this.subcategoryId = subcategoryId;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public boolean isVisible() {
		return isVisible;
	}

	public void setVisible(boolean visible) {
		isVisible = visible;
	}

	public boolean isOrderable() {
		return isOrderable;
	}

	public void setOrderable(boolean orderable) {
		isOrderable = orderable;
	}

	public int getSubcategoryId() {
		return subcategoryId;
	}

	public void setSubcategoryId(int subcategoryId) {
		this.subcategoryId = subcategoryId;
	}
}
