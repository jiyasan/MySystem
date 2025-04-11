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
		// テーブルが存在し、かつ使用可能（is_active = true）であれば true
		return tableMapper.countValidTableById(tableId) > 0;
	}
}
