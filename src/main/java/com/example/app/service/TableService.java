package com.example.app.service;

public interface TableService {
	boolean isValidTable(int tableId);

	void markAsOccupied(int shopId, int tableId);

	void markAsEmpty(int shopId, int tableId);
}
