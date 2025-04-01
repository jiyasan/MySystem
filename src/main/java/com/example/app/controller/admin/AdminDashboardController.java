package com.example.app.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.app.entity.Shop;
import com.example.app.service.ShopService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private ShopService shopService;
    
    // ダッシュボードTOP
    @GetMapping("") // ← 確認のために明記
    public String showDashboard() {
        return "admin/dashboard/index";
    }

    // 店舗一覧
    @GetMapping("/shop_list")
    public String showShopList(Model model) {
        List<Shop> shopList = shopService.findAll();
        model.addAttribute("shopList", shopList);
        return "admin/dashboard/shop_list";
    }

    // 従業員一覧
    @GetMapping("/employee_list")
    public String showEmployeeList(Model model) {
        // employeeService で一覧取得
        return "admin/dashboard/employee_list";
    }

    // シフト管理
    @GetMapping("/shift_management")
    public String showShiftManagement() {
        return "admin/dashboard/shift_management";
    }

    // ログアウト
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/admin/login";
    }
}
