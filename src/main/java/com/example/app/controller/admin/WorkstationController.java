package com.example.app.controller.admin;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.app.dto.LayoutItem;
import com.example.app.entity.MenuCategory;
import com.example.app.entity.MenuItem;
import com.example.app.entity.MenuSubcategory;
import com.example.app.mapper.MenuMapper;
import com.example.app.service.LayoutService;
import com.example.app.service.ShopService;
import com.example.app.util.NullSafeList;

@Controller
@RequestMapping("/admin/{shopId}_dashboard/workstation")
public class WorkstationController {

	@Autowired
	private LayoutService layoutService;

	@Autowired
	private ShopService shopService;

	@Autowired
	private MenuMapper menuMapper;

	// テーブルレイアウト表示
	@GetMapping("/table/list")
	public String tableListPartial(@PathVariable("shopId") int shopId, Model model) {
		List<LayoutItem> layoutItems = layoutService.getLayoutWithStatus(shopId);
		model.addAttribute("layoutItems", layoutItems);
		model.addAttribute("shopId", shopId);
		return "admin/shop_dashboard/workstation/table/list";
	}

	// メニュー一覧表示
	@GetMapping("/menu/list")
	public String showMenuList(@PathVariable("shopId") int shopId, Model model) {
		List<MenuCategory> categoryList = NullSafeList.of(menuMapper.findCategoriesByShopId(shopId));
		List<MenuSubcategory> subcategoryList = NullSafeList.of(menuMapper.findSubcategoriesByShopId(shopId));
		List<MenuItem> itemList = NullSafeList.of(menuMapper.findItemsByShopId(shopId));
		Map<Integer, List<MenuSubcategory>> subcategoryMap = subcategoryList.stream()
				.collect(Collectors.groupingBy(MenuSubcategory::getCategoryId));

		Map<String, List<MenuItem>> itemMap = itemList.stream()
				.collect(Collectors.groupingBy(i -> i.getItemCategory() + "-" + i.getItemSubcategory()));

		model.addAttribute("subcategoryMap", subcategoryMap);
		model.addAttribute("itemMap", itemMap);

		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryList", categoryList);
		model.addAttribute("subcategoryList", subcategoryList);
		model.addAttribute("itemList", itemList);
		return "admin/shop_dashboard/workstation/menu/list";
	}

	// メニュー詳細表示
	@GetMapping("/menu/{categoryId}/{subcategoryId}/{itemId}")
	public String showMenuDetail(
			@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@PathVariable("subcategoryId") int subcategoryId,
			@PathVariable("itemId") int itemId,
			Model model) {
		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryId", categoryId);
		model.addAttribute("subcategoryId", subcategoryId);
		model.addAttribute("itemId", itemId);

		return "admin/shop_dashboard/workstation/menu/detail";
	}

	// 大分類編集画面
	@GetMapping("/menu/{categoryId}/edit")
	public String showEditCategory(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			Model model) {
		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryId", categoryId);
		return "admin/shop_dashboard/workstation/menu/edit_category";
	}

	// 中分類編集画面
	@GetMapping("/menu/{categoryId}/{subcategoryId}/edit")
	public String showEditSubcategory(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@PathVariable("subcategoryId") int subcategoryId,
			Model model) {
		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryId", categoryId);
		model.addAttribute("subcategoryId", subcategoryId);
		return "admin/shop_dashboard/workstation/menu/edit_subcategory";
	}

	// 商品編集画面
	@GetMapping("/menu/{categoryId}/{subcategoryId}/{itemId}/edit")
	public String showEditItem(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@PathVariable("subcategoryId") int subcategoryId,
			@PathVariable("itemId") int itemId,
			Model model) {
		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryId", categoryId);
		model.addAttribute("subcategoryId", subcategoryId);
		model.addAttribute("itemId", itemId);
		return "admin/shop_dashboard/workstation/menu/edit_item";
	}

	// 大分類追加
	@GetMapping("/menu/add")
	public String showAddCategory(@PathVariable("shopId") int shopId, Model model) {
		model.addAttribute("shopId", shopId);
		return "admin/shop_dashboard/workstation/menu/add_category";
	}

	// 中分類追加
	@GetMapping("/menu/{categoryId}/add")
	public String showAddSubcategory(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			Model model) {
		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryId", categoryId);
		return "admin/shop_dashboard/workstation/menu/add_subcategory";
	}

	// 商品追加
	@GetMapping("/menu/{categoryId}/{subcategoryId}/add")
	public String showAddItem(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@PathVariable("subcategoryId") int subcategoryId,
			Model model) {
		MenuCategory category = menuMapper.findCategoryById(categoryId);
		MenuSubcategory subcategory = menuMapper.findSubcategoryById(subcategoryId);

		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryId", categoryId);
		model.addAttribute("subcategoryId", subcategoryId);
		model.addAttribute("category", category);
		model.addAttribute("subcategory", subcategory);

		return "admin/shop_dashboard/workstation/menu/add_item";
	}

	// オーダー一覧表示
	@GetMapping("/order/list")
	public String orderList(@PathVariable int shopId, Model model) {
		model.addAttribute("shopId", shopId);
		return "admin/shop_dashboard/workstation/order/list";
	}

	// 大分類追加処理
	@PostMapping("/menu/add")
	public String addCategory(@RequestParam("shopId") int shopId,
			@RequestParam("categoryName") String categoryName) {
		MenuCategory category = new MenuCategory();
		category.setShopId(shopId);
		category.setCategoryName(categoryName);
		menuMapper.insertCategory(category);
		return "redirect:/admin/" + shopId + "_dashboard/workstation/menu/list";
	}

	// 中分類追加処理
	@PostMapping("/menu/{categoryId}/add")
	public String addSubcategory(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@RequestParam("subcategoryName") String subcategoryName) {
		MenuSubcategory sub = new MenuSubcategory();
		sub.setShopId(shopId);
		sub.setCategoryId(categoryId);
		sub.setSubcategoryName(subcategoryName);
		menuMapper.insertSubcategory(sub);
		return "redirect:/admin/" + shopId + "_dashboard/workstation/menu/list";
	}

	// 商品追加処理
	@PostMapping("/menu/{categoryId}/{subcategoryId}/add")
	public String addMenuItem(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@PathVariable("subcategoryId") int subcategoryId,
			@RequestParam("itemName") String itemName,
			@RequestParam("itemDetail") String itemDetail,
			@RequestParam("price") Integer price,
			@RequestParam(name = "stockQuantity", required = false) Integer stockQuantity,
			@RequestParam(name = "isVisible", defaultValue = "false") boolean isVisible,
			@RequestParam(name = "isOrderable", defaultValue = "false") boolean isOrderable) {

		MenuItem item = new MenuItem();
		item.setShopId(shopId);
		item.setItemCategory(categoryId);
		item.setItemSubcategory(subcategoryId);
		item.setItemName(itemName);
		item.setItemDetail(itemDetail);
		item.setPrice(price);
		item.setStockQuantity(stockQuantity);
		item.setIsVisible(isVisible);
		item.setIsOrderable(isOrderable);

		menuMapper.insertMenuItem(item);
		return "redirect:/admin/" + shopId + "_dashboard/workstation/menu/list";
	}

}
