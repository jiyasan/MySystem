package com.example.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LayoutItem {

	private int rowIndex;
	private int colIndex;
	private String type; // "table" / "other" など
	private String name; // 表示名（テーブル名など）
	private String color; // セルの背景色
	private int rowspan; // 結合の行数
	private int colspan; // 結合の列数
	private String status; // UI用：予約済み / 使用中など

	@JsonProperty("isBase")
	private boolean base; // is_base: true=代表セル

	@JsonProperty("isDeleted")
	private boolean deleted; // is_deleted: true=非表示セル

	// 💡 コンストラクタ（@RequestBodyで必要）
	public LayoutItem() {
	}

	// --- Getter / Setter ---
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public boolean isBase() {
		return base;
	}

	public void setBase(boolean base) {
		this.base = base;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
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
				", status='" + status + '\'' +
				", base=" + base +
				", deleted=" + deleted +
				'}';
	}
}
