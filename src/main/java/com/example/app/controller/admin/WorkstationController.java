package com.example.app.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.app.dto.LayoutItem;
import com.example.app.entity.Employee;
import com.example.app.entity.MenuCategory;
import com.example.app.entity.MenuItem;
import com.example.app.entity.MenuSubcategory;
import com.example.app.entity.Shop;
import com.example.app.mapper.MenuMapper;
import com.example.app.service.LayoutService;
import com.example.app.service.ShopService;

import jakarta.servlet.http.HttpSession;

@Controller
public class WorkstationController {

	@Autowired
	private LayoutService layoutService;

	@Autowired
	private ShopService shopService;

	@Autowired
	private MenuMapper menuMapper;
	
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

	@GetMapping("/admin/{shopId}_dashboard/workstation/table/list")
	public String tableListPartial(@PathVariable("shopId") int shopId, Model model) {
		List<LayoutItem> layoutItems = layoutService.getLayoutWithStatus(shopId);
		model.addAttribute("layoutItems", layoutItems);
		model.addAttribute("shopId", shopId);
		return "admin/shop_dashboard/workstation/table/list";
	}

	@GetMapping("/admin/{shopId}_dashboard/workstation/menu/list")
	public String showMenuList(@PathVariable("shopId") int shopId, Model model) {
	    List<MenuCategory> categoryList = menuMapper.findCategoriesByShopId(shopId);
	    List<MenuSubcategory> subcategoryList = menuMapper.findSubcategoriesByShopId(shopId);
	    List<MenuItem> itemList = menuMapper.findItemsByShopId(shopId);

	    model.addAttribute("shopId", shopId);
	    model.addAttribute("categoryList", categoryList);
	    model.addAttribute("subcategoryList", subcategoryList);
	    model.addAttribute("itemList", itemList);
	    return "admin/shop_dashboard/workstation/menu_list";
	}

	@GetMapping("/admin/{shopId}_dashboard/workstation/order/list")
	public String orderList(@PathVariable int shopId, Model model) {
		model.addAttribute("shopId", shopId);
		return "admin/shop_dashboard/workstation/order/list";
	}

}
