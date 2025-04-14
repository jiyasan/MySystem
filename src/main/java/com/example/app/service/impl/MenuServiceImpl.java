package com.example.app.service.impl;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.entity.MenuItem;
import com.example.app.mapper.MenuMapper;
import com.example.app.service.MenuService;

@Service
public class MenuServiceImpl implements MenuService {

	@Autowired
	private MenuMapper menuMapper;

	@Override
	public BigDecimal getPriceByMenuItemId(int menuItemId) {
		MenuItem item = menuMapper.findMenuItemById(menuItemId);
		if (item != null) {
			return BigDecimal.valueOf(item.getPrice());
		}
		return null;
	}
}