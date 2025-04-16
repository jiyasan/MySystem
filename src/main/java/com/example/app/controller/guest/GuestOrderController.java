// GuestOrderController.java
package com.example.app.controller.guest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.dto.OrderWithItemsDTO;
import com.example.app.entity.OrderItem;
import com.example.app.service.OrderService;

@RestController
@RequestMapping("/guest/api/order")
public class GuestOrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> submitOrder(@RequestBody OrderWithItemsDTO dto) {
    	System.out.println("🚀 注文受信！sessionId = " + dto.getSessionId());
    	System.out.println("📦 items = " + dto.getItems());

    	
    	for (OrderItem item : dto.getItems()) {
    		System.out.println("🧾 menuItemId = " + item.getMenuItemId());
    		System.out.println("　quantity    = " + item.getQuantity());
    		System.out.println("　nickname    = " + item.getNickname());
    		System.out.println("　colorCode   = " + item.getColorCode());
    		System.out.println("　status      = " + item.getStatus());
    	}

        try {
            orderService.createOrder(dto);
            return ResponseEntity.ok().body("注文を受け付けました");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("注文処理に失敗しました");
        }
    }
}
