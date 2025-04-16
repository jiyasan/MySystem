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

	@Override
	public void createOrder(OrderWithItemsDTO dto) {
		System.out.println("📦 createOrder(): sessionId = " + dto.getSessionId());

		Order order = new Order();
		order.setSessionId(dto.getSessionId());
		order.setShopId(dto.getShopId());
		order.setNote(dto.getNote());
		order.setCreatedBy(dto.getCreatedBy());
		order.setTotalPrice(dto.getTotalPrice());
		order.setOrderedAt(java.time.LocalDateTime.now());

		orderMapper.insertOrder(order);
		System.out.println("✅ order_id = " + order.getOrderId());

		for (OrderItem item : dto.getItems()) {
			item.setOrderId(order.getOrderId());
			item.setOrderedAt(order.getOrderedAt());
			orderMapper.insertOrderItem(item);
		}
	}

}
