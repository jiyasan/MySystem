package com.example.app.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.app.entity.Table;

@Mapper
public interface TableMapper {
    void insert(Table table);
    void deleteByShopId(int shopId); // 任意：レイアウト連携型なら
}
