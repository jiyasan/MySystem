package com.example.app.entity;

import java.time.LocalDateTime;

public class CustomerSession {

	private String customerSessionsId;
	private int tableId;
	private int guestCount;
	private LocalDateTime startedAt;
	private LocalDateTime endedAt;
	private boolean isPaid;
	private int totalAmount;
	private String note;
	private int shopId;

	// --- Getter / Setter ---

	public int getShopId() {
		return shopId;
	}

	public void setShopId(int shopId) {
		this.shopId = shopId;
	}

	public String getCustomerSessionsId() {
		return customerSessionsId;
	}

	public void setCustomerSessionsId(String customerSessionsId) {
		this.customerSessionsId = customerSessionsId;
	}

	public int getTableId() {
		return tableId;
	}

	public void setTableId(int tableId) {
		this.tableId = tableId;
	}

	public int getGuestCount() {
		return guestCount;
	}

	public void setGuestCount(int guestCount) {
		this.guestCount = guestCount;
	}

	public LocalDateTime getStartedAt() {
		return startedAt;
	}

	public void setStartedAt(LocalDateTime startedAt) {
		this.startedAt = startedAt;
	}

	public LocalDateTime getEndedAt() {
		return endedAt;
	}

	public void setEndedAt(LocalDateTime endedAt) {
		this.endedAt = endedAt;
	}

	public boolean isPaid() {
		return isPaid;
	}

	public void setIsPaid(boolean isPaid) {
		this.isPaid = isPaid;
	}

	public int getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(int totalAmount) {
		this.totalAmount = totalAmount;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}
}
