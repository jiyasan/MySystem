package com.example.app.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.app.dto.LayoutItem;
import com.example.app.dto.LoginForm;
import com.example.app.entity.Employee;
import com.example.app.entity.Shop;
import com.example.app.mapper.ShopLayoutMapper;
import com.example.app.mapper.ShopMapper;
import com.example.app.service.ShopService;

import jakarta.servlet.http.HttpSession;

@Controller
public class ShopDashboardController {

	@Autowired
	private ShopLayoutMapper shopLayoutMapper;

	@Autowired
	private ShopService shopService;
	
	@Autowired
	private ShopMapper shopMapper;

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
		return "admin/shop_dashboard/index";
	}
	
	@GetMapping("/admin/{shopId}_dashboard/workstation")
	public String showWorkstation(
			@PathVariable("shopId") int shopId,
			HttpSession session,
			Model model) {

		Employee loginUser = (Employee) session.getAttribute("loginUser");

		Shop shop = shopService.findById(shopId);
		model.addAttribute("shop", shop);

		if (loginUser == null) {
			model.addAttribute("message", "セッションが切れています。ログインしなおしてください。");
			model.addAttribute("sessionExpired", true); // ← JSやViewで切り替えたい場合にも使える
		} else {
			model.addAttribute("message", shop.getShopName() + " のワークステーションを表示中");
			model.addAttribute("loginUser", loginUser);
		}

		return "admin/shop_dashboard/workstation/index";
	}
	
	@GetMapping("/admin/{shopId}_dashboard/layout")
	public String showLayout(@PathVariable("shopId") int shopId, Model model) {
	    List<LayoutItem> layoutItems = shopLayoutMapper.findByShopId(shopId);
	    Shop shop = shopMapper.findById(shopId); // ← ★ここがポイント

	    model.addAttribute("layoutItems", layoutItems);
	    model.addAttribute("shopId", shopId);
	    model.addAttribute("shop", shop); // Shopオブジェクト

	    return "admin/shop_dashboard/layout/index";
	}


}
