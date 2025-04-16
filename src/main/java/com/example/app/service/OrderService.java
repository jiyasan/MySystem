package com.example.app.service;

import java.util.List;

import com.example.app.dto.OrderWithItemsDTO;
import com.example.app.entity.Order;

public interface OrderService {
	
	void createOrder(OrderWithItemsDTO dto);

	List<OrderWithItemsDTO> findAllOrdersWithItems(int shopId);

	// ステータスごとの取得メソッド
	List<Order> findUnstartedOrders(int shopId); // status = 0

	List<Order> findInProgressOrders(int shopId); // status = 1

	List<Order> findDoneOrders(int shopId); // status = 2
}
