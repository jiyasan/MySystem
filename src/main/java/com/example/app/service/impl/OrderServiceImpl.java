package com.example.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.dto.OrderWithItemsDTO;
import com.example.app.entity.Order;
import com.example.app.entity.OrderItem;
import com.example.app.mapper.OrderMapper;
import com.example.app.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {

	@Autowired
	private OrderMapper orderMapper;

	@Override
	public List<OrderWithItemsDTO> findAllOrdersWithItems(int shopId) {
		List<OrderWithItemsDTO> orders = orderMapper.findOrdersByShopId(shopId);
		
		for (OrderWithItemsDTO order : orders) {
			List<OrderItem> items = orderMapper.findOrderItemsWithCategory(order.getOrderId());
			order.setItems(items);
		}
		
		return orders;
	}
	
	@Override
	public List<Order> findUnstartedOrders(int shopId) {
		return orderMapper.findOrdersByStatus(shopId, 0); // 対応中
	}

	@Override
	public List<Order> findInProgressOrders(int shopId) {
		return orderMapper.findOrdersByStatus(shopId, 1); // 完成済
	}

	@Override
	public List<Order> findDoneOrders(int shopId) {
		return orderMapper.findOrdersByStatus(shopId, 2); // 提供済
	}
	
}
