package com.example.app.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.entity.CustomerSession;

@Mapper
public interface CustomerSessionMapper {

    // 未会計のセッションが存在するか確認（テーブルごとに1件）
	CustomerSession findUnpaidByTableId(@Param("tableId") int tableId);
	int countUnpaidSessionByTableId(@Param("tableId") int tableId);

    // セッション登録
    void insert(CustomerSession session);
    CustomerSession findById(@Param("sessionId") String sessionId);
}
