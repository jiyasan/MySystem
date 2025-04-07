package com.example.app.mapper;

import java.util.List;

import com.example.app.dto.TableStatus;

public interface TableStatusMapper {
    List<TableStatus> findStatusByShopId(int shopId);
}
