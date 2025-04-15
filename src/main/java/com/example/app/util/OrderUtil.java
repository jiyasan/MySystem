// src/main/java/com/example/app/util/OrderUtil.java
package com.example.app.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.app.dto.OrderWithItemsDTO;
import com.example.app.entity.OrderItem;

public class OrderUtil {

    public static Map<Integer, List<OrderWithItemsDTO>> splitByStatus(List<OrderWithItemsDTO> orders) {
        Map<Integer, List<OrderWithItemsDTO>> map = new HashMap<>();
        map.put(0, new ArrayList<>());
        map.put(1, new ArrayList<>());
        map.put(2, new ArrayList<>());

        for (OrderWithItemsDTO order : orders) {
            int status = order.getItems().stream()
                    .map(OrderItem::getStatus)
                    .min(Integer::compareTo)
                    .orElse(0);
            map.get(status).add(order);
        }

        return map;
    }
}
