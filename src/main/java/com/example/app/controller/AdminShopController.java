package com.example.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.app.entity.Shop;
import com.example.app.service.ShopService;

@Controller
@RequestMapping("/admin/dashboard")
public class AdminShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping("/shop_list")
    public String showShopList(Model model) {
        List<Shop> shopList = shopService.findAll();
        model.addAttribute("shopList", shopList);
        return "admin/dashboard/shop_list";
    }

    // 他にも shop_add, shop_detail, shop_edit をここに追加！
}
