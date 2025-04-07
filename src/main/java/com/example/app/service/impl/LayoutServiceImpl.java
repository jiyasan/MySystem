package com.example.app.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.dto.LayoutItem;
import com.example.app.dto.TableStatus;
import com.example.app.mapper.ShopLayoutMapper;
import com.example.app.mapper.TableStatusMapper;
import com.example.app.service.LayoutService;

@Service
public class LayoutServiceImpl implements LayoutService {

    @Autowired
    private ShopLayoutMapper shopLayoutMapper;

    @Autowired
    private TableStatusMapper tableStatusMapper;

    @Override
    public List<LayoutItem> getLayoutWithStatus(int shopId) {
        // レイアウト情報を取得
        List<LayoutItem> layoutItems = shopLayoutMapper.findByShopId(shopId);

        // テーブルごとのステータスを取得（Map: table_name -> status）
        Map<String, String> statusMap = tableStatusMapper.findStatusByShopId(shopId).stream()
                .collect(Collectors.toMap(
                        TableStatus::getTableName,
                        TableStatus::getStatus
                ));

        // テーブルに該当するレイアウトに状態を付与
        for (LayoutItem item : layoutItems) {
            if ("table".equals(item.getType()) && item.isBase()) {
                String tableName = item.getName();
                String status = statusMap.getOrDefault(tableName, "empty"); // デフォルトは空席
                item.setStatus(status);
            }
        }

        return layoutItems;
    }
}
