package com.example.app.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.app.dto.LoginForm;
import com.example.app.entity.Employee;
import com.example.app.entity.Shop;
import com.example.app.service.ShopService;

import jakarta.servlet.http.HttpSession;


@Controller
public class ShopDashboardController {

    @Autowired
    private ShopService shopService;

    @GetMapping("/admin/{shopId}_dashboard")
    public String showShopDashboard(@PathVariable("shopId") int shopId, Model model, HttpSession session) {
        Employee loginUser = (Employee) session.getAttribute("loginUser");
        model.addAttribute("loginUser", loginUser);

        Shop shop = shopService.findById(shopId);
        model.addAttribute("shop", shop);

        if (shop == null) {
            model.addAttribute("errorMessage", "店舗情報が見つかりません");
            
            model.addAttribute("loginForm", new LoginForm());

            return "admin/login"; // 仮戻り先（未ログイン or エラー時）
        }
        model.addAttribute("shop", shop);
        return "admin/shop_dashboard/index"; // ← テンプレート
    }
    
    @GetMapping("/admin/{shopId}_dashboard/layout")
    public String showLayoutIndex(@PathVariable("shopId") int shopId, Model model) {
        model.addAttribute("shopId", shopId);
        // TODO: レイアウトデータの取得
        return "admin/shop_dashboard/layout/index";
    }

}
