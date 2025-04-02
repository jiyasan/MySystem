package com.example.app.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.app.entity.Employee;
import com.example.app.entity.Shop;
import com.example.app.service.ShopService;

import jakarta.servlet.http.HttpSession;

@Controller
public class WorkstationController {

	@Autowired
	private ShopService shopService;

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
	
	@GetMapping("/workstation/table_list")
	public String tableListPartial(@RequestParam("shopId") int shopId, Model model) {
	    // 必要なデータ取得
	    model.addAttribute("shopId", shopId);
	    return "fragments/workstation/table_list"; // 例：部分テンプレ
	}


}
