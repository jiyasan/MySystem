package com.example.app.dto;

public class LayoutItem {

	private int rowIndex;
	private int colIndex;
	private String type;
	private String name;
	private String color;
	private int rowspan;
	private int colspan;
	private boolean isBase;

	public LayoutItem() {
		// デフォルトコンストラクタ必須（@RequestBody用）
	}

	public int getRowIndex() {
		return rowIndex;
	}

	public void setRowIndex(int rowIndex) {
		this.rowIndex = rowIndex;
	}

	public int getColIndex() {
		return colIndex;
	}

	public void setColIndex(int colIndex) {
		this.colIndex = colIndex;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public int getRowspan() {
		return rowspan;
	}

	public void setRowspan(int rowspan) {
		this.rowspan = rowspan;
	}

	public int getColspan() {
		return colspan;
	}

	public void setColspan(int colspan) {
		this.colspan = colspan;
	}

	public boolean getIsBase() {
		return isBase;
	}

	public void setIsBase(boolean isBase) {
		this.isBase = isBase;
	}

	@Override
	public String toString() {
		return "LayoutItem{" +
				"rowIndex=" + rowIndex +
				", colIndex=" + colIndex +
				", type='" + type + '\'' +
				", name='" + name + '\'' +
				", color='" + color + '\'' +
				", rowspan=" + rowspan +
				", colspan=" + colspan +
				'}';
	}
}
