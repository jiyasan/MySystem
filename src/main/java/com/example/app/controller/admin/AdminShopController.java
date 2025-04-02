package com.example.app.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.app.entity.Shop;
import com.example.app.service.ShopService;

@Controller
@RequestMapping("/admin/dashboard/shop")
public class AdminShopController {

	@Autowired
	private ShopService shopService;

	// 新規店舗登録画面
	@GetMapping("/add")
	public String showShopAddForm() {
		return "admin/dashboard/shop/add";
	}

	// 店舗登録処理
	@PostMapping("/add")
	public String addShop(@RequestParam("shopName") String shopName, Model model) {
		if (shopService.isShopNameDuplicate(shopName)) {
			model.addAttribute("errorMessage", "同じ店舗名がすでに存在します");
			return "admin/dashboard/shop/add";
		}

		int newShopId = shopService.addShop(shopName); // ← 返り値をIDに変える

		return "redirect:/admin/dashboard/shop/detail/" + newShopId;
	}

	// 店舗詳細表示
	@GetMapping("/detail/{id}")
	public String showShopDetail(@PathVariable("id") int shopId, Model model) {
		Shop shop = shopService.findById(shopId);
		if (shop == null) {
			model.addAttribute("errorMessage", "該当する店舗が見つかりません");
			return "admin/dashboard/shop/list"; // 一覧に戻す
		}
		model.addAttribute("shop", shop);
		return "admin/dashboard/shop/detail";
	}

	// 店舗情報編集画面
	@GetMapping("/edit/{id}")
	public String showShopEditForm(@PathVariable("id") int shopId, Model model) {
		Shop shop = shopService.findById(shopId);
		if (shop == null) {
			model.addAttribute("errorMessage", "該当する店舗が見つかりません");
			return "admin/dashboard/shop/list";
		}
		model.addAttribute("shop", shop);
		return "admin/dashboard/shop/edit";
	}

	// 店舗情報更新処理
	@PostMapping("/edit/{id}")
	public String updateShop(
			@PathVariable("id") int shopId,
			@ModelAttribute Shop updatedShop,
			Model model) {
		updatedShop.setShopId(shopId); // 念のためIDセット
		shopService.updateShop(updatedShop);
		return "redirect:/admin/dashboard/shop/detail/" + shopId;
	}
}
