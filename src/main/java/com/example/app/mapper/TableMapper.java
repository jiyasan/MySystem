package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.entity.CustomerSession;
import com.example.app.entity.OrderItem;
import com.example.app.entity.Table;

@Mapper
public interface TableMapper {
	Table findByShopIdAndName(@Param("shopId") int shopId, @Param("tableName") String tableName);

	void revive(@Param("shopId") int shopId, @Param("tableName") String tableName);

	void insert(Table table);

	int countValidTableById(@Param("tableId") int tableId);

	int findShopIdByTableId(@Param("tableId") int tableId);

	List<Table> findByShopId(@Param("shopId") int shopId);

	Table findById(@Param("tableId") int tableId);

	CustomerSession findSessionByTableId(@Param("tableId") int tableId);

	List<OrderItem> findOrderItemsByTableId(@Param("tableId") int tableId);
}