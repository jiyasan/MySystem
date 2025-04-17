package com.example.app.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.mapper.TableMapper;
import com.example.app.service.TableService;

@Service
public class TableServiceImpl implements TableService {

	@Autowired
	private TableMapper tableMapper;
	
	@Override
	public boolean isValidTable(int tableId) {
		// 存在確認（例）
		return tableMapper.findById(tableId) != null;
	}
	
	@Override
	public void markAsOccupied(int shopId, int tableId) {
		tableMapper.updateTableStatus(shopId, tableId, 1); // 1 = 着席
	}

	@Override
	public void markAsEmpty(int shopId, int tableId) {
		tableMapper.updateTableStatus(shopId, tableId, 0); // 0 = 空席
	}

}
