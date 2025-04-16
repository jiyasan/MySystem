// src/main/java/com/example/app/mapper/OrderMapper.java

package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.example.app.dto.OrderWithItemsDTO;
import com.example.app.entity.Order;
import com.example.app.entity.OrderItem;

public interface OrderMapper {
	
	void insertOrder(@Param("order") Order order);
	void insertOrderItem(@Param("item") OrderItem item);

    // ステータスごとの取得（既存）
    List<Order> findOrdersByStatus(@Param("shopId") int shopId, @Param("status") int status);

    // 🆕 追加！shop_id で全オーダー取得
    List<OrderWithItemsDTO> findOrdersByShopId(@Param("shopId") int shopId);

    // 🆕 追加！order_id で明細＋is_food取得
    List<OrderItem> findOrderItemsWithCategory(@Param("orderId") int orderId);
}
