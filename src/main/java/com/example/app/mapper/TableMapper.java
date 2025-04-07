package com.example.app.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.entity.Table;

@Mapper
public interface TableMapper {

 // すでに存在する名前をチェック
    Table findByShopIdAndName(@Param("shopId") int shopId, @Param("tableName") String tableName);

    // 論理削除されたテーブルを復活させる
    void revive(@Param("shopId") int shopId, @Param("tableName") String tableName);

    // insert
    void insert(Table table);

}
