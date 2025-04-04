package com.example.app.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.app.dto.LoginForm;
import com.example.app.entity.Employee;
import com.example.app.entity.Shop;
import com.example.app.service.EmployeeService;
import com.example.app.service.ShopService;

import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private ShopService shopService;

	@GetMapping("/admin/login")
	public String showLoginForm(Model model) {
		model.addAttribute("loginForm", new LoginForm());
		return "/admin/login";
	}

	@PostMapping("/admin/login")
	public String login(@ModelAttribute LoginForm form, Model model, HttpSession session) {
		Employee loginUser = employeeService.authenticate(form.getLoginId(), form.getLoginPass());

		if (loginUser == null) {
			model.addAttribute("loginError", "IDまたはパスワードが間違っています.");
			return "admin/login"; // GetMappingと合わせる
		}

		session.setAttribute("loginUser", loginUser); // セッション保持

		int pos = loginUser.getPosition();

		if (pos == 3) {
			int shopId = loginUser.getShopId();
			Shop shop = shopService.findById(shopId);
			if (shop == null) {
				model.addAttribute("loginError", "IDまたはパスワードが間違っています"); // ← 店舗情報欠落（内部エラー）
				return "admin/login";
			}
			// パートタイマー：業務用ダッシュボードのみ
			return "redirect:/admin/" + shopId + "_dashboard";
		} else {
			// 管理者または店舗配属：本部 or 店舗どちらでも操作可能
			return "redirect:/admin/dashboard";
		}
	}
}
