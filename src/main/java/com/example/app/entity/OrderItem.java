package com.example.app.entity;

import java.time.LocalDateTime;

public class OrderItem {
	private int orderItemId;
	private int orderId;
	private int menuItemId;
	private int quantity;
	private LocalDateTime orderedAt;
	private boolean isCanceled;
	private String nickname;
	private String colorCode;
	private int status; // 0:対応中, 1:完成, 2:提供済み
	private Integer completedBy;
	private Integer servedBy;
	private LocalDateTime completedAt;
	private LocalDateTime servedAt;

	// ゲッターとセッター
	public int getOrderItemId() {
		return orderItemId;
	}

	public void setOrderItemId(int orderItemId) {
		this.orderItemId = orderItemId;
	}

	public int getOrderId() {
		return orderId;
	}

	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}

	public int getMenuItemId() {
		return menuItemId;
	}

	public void setMenuItemId(int menuItemId) {
		this.menuItemId = menuItemId;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public LocalDateTime getOrderedAt() {
		return orderedAt;
	}

	public void setOrderedAt(LocalDateTime orderedAt) {
		this.orderedAt = orderedAt;
	}

	public boolean isCanceled() {
		return isCanceled;
	}

	public void setCanceled(boolean canceled) {
		this.isCanceled = canceled;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getColorCode() {
		return colorCode;
	}

	public void setColorCode(String colorCode) {
		this.colorCode = colorCode;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Integer getCompletedBy() {
		return completedBy;
	}

	public void setCompletedBy(Integer completedBy) {
		this.completedBy = completedBy;
	}

	public Integer getServedBy() {
		return servedBy;
	}

	public void setServedBy(Integer servedBy) {
		this.servedBy = servedBy;
	}

	public LocalDateTime getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(LocalDateTime completedAt) {
		this.completedAt = completedAt;
	}

	public LocalDateTime getServedAt() {
		return servedAt;
	}

	public void setServedAt(LocalDateTime servedAt) {
		this.servedAt = servedAt;
	}
}