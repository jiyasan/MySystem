package com.example.app.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/admin/dashboard")
public class AdminDashboardController {

    // ダッシュボードTOP
    @GetMapping
    public String showDashboard() {
        return "admin/dashboard/index";
    }

    // 店舗一覧
    @GetMapping("/shop_list")
    public String showShopList(Model model) {
        // shopService で一覧取得
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
