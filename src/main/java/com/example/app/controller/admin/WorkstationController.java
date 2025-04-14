package com.example.app.controller.admin;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.example.app.dto.LayoutItem;
import com.example.app.entity.CustomerSession;
import com.example.app.entity.MenuCategory;
import com.example.app.entity.MenuItem;
import com.example.app.entity.MenuSubcategory;
import com.example.app.entity.OrderItem;
import com.example.app.entity.Table;
import com.example.app.mapper.MenuMapper;
import com.example.app.mapper.TableMapper;
import com.example.app.service.LayoutService;
import com.example.app.service.MenuService;
import com.example.app.service.ShopService;
import com.example.app.util.NullSafeList;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/admin/{shopId}_dashboard/workstation")
public class WorkstationController {

	@Autowired
	private LayoutService layoutService;

	@Autowired
	private ShopService shopService;

	@Autowired
	private MenuMapper menuMapper;

	@Autowired
	private TableMapper tableMapper;

	@Autowired
	private MenuService menuService;

	// テーブルレイアウト表示
	@GetMapping("/table/list")
	public String tableListPartial(@PathVariable("shopId") int shopId, Model model) throws JsonProcessingException {
		try {
			// 🔸 レイアウト情報取得
			List<LayoutItem> layoutItems = layoutService.getLayoutWithStatus(shopId);

			System.out.println("🟠 layoutItems.size() = " + layoutItems.size());
			for (LayoutItem item : layoutItems) {
				System.out.println("▶ " + item);
			}

			// 🔸 テーブルIDマッピング（name → table_id）
			List<Table> tables = tableMapper.findByShopId(shopId);
			System.out.println("🟠 tables.size() = " + tables.size());
			for (Table t : tables) {
				System.out.println("■ " + t.getTableName() + " -> ID: " + t.getTableId());
			}

			Map<String, Integer> tableIdMap = tables.stream()
					.collect(Collectors.toMap(Table::getTableName, Table::getTableId));

			// ✅ JSON文字列に変換
			String layoutItemsJson = new ObjectMapper().writeValueAsString(layoutItems);
			String tableIdMapJson = new ObjectMapper().writeValueAsString(tableIdMap);

			// 🔸 モデルに渡す
			model.addAttribute("shopId", shopId);
			model.addAttribute("layoutItems", layoutItems);
			model.addAttribute("tableIdMapJson", tableIdMapJson);
			model.addAttribute("layoutItemsJson", layoutItemsJson); // ← 🔧これを追加

			return "admin/shop_dashboard/workstation/table/list";

		} catch (Exception e) {
			e.printStackTrace(); // 必ずログ出力
			throw e;
		}
	}

	// テーブル詳細表示
	@GetMapping("/table/detail/{tableId}")
	public String tableDetail(
			@PathVariable("shopId") int shopId,
			@PathVariable("tableId") int tableId,
			Model model) {
		Table table = tableMapper.findById(tableId);
		if (table == null || table.getShopId() != shopId) {
			throw new IllegalArgumentException("無効なテーブルID");
		}

		CustomerSession session = tableMapper.findSessionByTableId(tableId);
		List<OrderItem> orderItems = tableMapper.findOrderItemsByTableId(tableId);

		// menu_items から価格を取得して合計計算
		BigDecimal totalBill = BigDecimal.ZERO;
		for (OrderItem item : orderItems) {
			// menu_item_id から価格を取得（仮に別マッパーで）
			// 実際には MenuItemMapper などが必要
			BigDecimal price = menuService.getPriceByMenuItemId(item.getMenuItemId());
			if (price != null) {
				totalBill = totalBill.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
			}
		}

		model.addAttribute("shopId", shopId);
		model.addAttribute("table", table);
		model.addAttribute("session", session);
		model.addAttribute("orderItems", orderItems);
		model.addAttribute("totalBill", totalBill);

		return "admin/shop_dashboard/workstation/table/detail";
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

	// 大分類編集画面表示
	@GetMapping("/menu/{categoryId}/edit")
	public String showEditCategory(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			Model model) {
		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryId", categoryId);
		model.addAttribute("category", menuMapper.findCategoryById(categoryId));
		return "admin/shop_dashboard/workstation/menu/edit_category";
	}

	// 中分類編集画面表示
	@GetMapping("/menu/{categoryId}/{subcategoryId}/edit")
	public String showEditSubcategory(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@PathVariable("subcategoryId") int subcategoryId,
			Model model) {
		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryId", categoryId);
		model.addAttribute("subcategoryId", subcategoryId);
		model.addAttribute("subcategory", menuMapper.findSubcategoryById(subcategoryId));

		return "admin/shop_dashboard/workstation/menu/edit_subcategory";
	}

	// 商品編集画面表示
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

	// 大分類追加画面表示
	@GetMapping("/menu/add")
	public String showAddCategory(@PathVariable("shopId") int shopId, Model model) {
		model.addAttribute("shopId", shopId);
		return "admin/shop_dashboard/workstation/menu/add_category";
	}

	// 中分類追加画面表示
	@GetMapping("/menu/{categoryId}/add")
	public String showAddSubcategory(@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			Model model) {
		model.addAttribute("shopId", shopId);
		model.addAttribute("categoryId", categoryId);

		MenuCategory category = menuMapper.findCategoryById(categoryId);
		model.addAttribute("category", category);

		return "admin/shop_dashboard/workstation/menu/add_subcategory";
	}

	// 商品追加画面表示
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

	//ここからPOST処理

	// 大分類追加処理
	@PostMapping("/menu/add")

	@ResponseBody
	public Map<String, Object> addCategory(@RequestParam("shopId") int shopId,
			@RequestParam("categoryName") String categoryName) {
		Map<String, Object> response = new HashMap<>();
		try {
			MenuCategory category = new MenuCategory();
			category.setShopId(shopId);
			category.setCategoryName(categoryName);
			menuMapper.insertCategory(category);

			response.put("success", true);
			response.put("message", "大分類を追加しました");
			response.put("redirectUrl", "/admin/" + shopId + "_dashboard/workstation/menu/list"); // メニューリストのURL

			return response;

		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "エラー: " + e.getMessage());
			return response;
		}
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
	public String addMenuItem(
			@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@PathVariable("subcategoryId") int subcategoryId,
			@RequestParam("itemName") String itemName,
			@RequestParam("itemDetail") String itemDetail,
			@RequestParam("price") int price,
			@RequestParam(name = "stockQuantity", required = false) Integer stockQuantity,
			@RequestParam(name = "isVisible", defaultValue = "false") boolean isVisible,
			@RequestParam(name = "isOrderable", defaultValue = "false") boolean isOrderable,
			@RequestParam(name = "itemImage", required = false) MultipartFile imageFile,
			@RequestParam(name = "selectedImageName", required = false) String selectedImageName,
			Model model) {
		String fileName = null;

		try {
			// 画像アップロードを優先
			if (imageFile != null && !imageFile.isEmpty()) {
				String originalName = imageFile.getOriginalFilename();
				String extension = originalName.substring(originalName.lastIndexOf("."));
				fileName = UUID.randomUUID() + extension;

				File uploadDir = new File("uploads/menu/" + shopId);
				if (!uploadDir.exists())
					uploadDir.mkdirs();

				File dest = new File(uploadDir, fileName);
				imageFile.transferTo(dest);
			} else if (selectedImageName != null && !selectedImageName.isEmpty()) {
				fileName = selectedImageName;
			}

			// メニューエンティティの作成
			MenuItem item = new MenuItem();
			item.setShopId(shopId);
			item.setItemCategory(categoryId);
			item.setItemSubcategory(subcategoryId);
			item.setItemName(itemName);
			item.setItemDetail(itemDetail);
			item.setPrice(price);
			item.setStockQuantity(stockQuantity);
			item.setItemImage(fileName); // 画像ファイル名のみ（null可）
			item.setIsVisible(isVisible);
			item.setIsOrderable(isOrderable);

			menuMapper.insertMenuItem(item); // Mapper直接呼び出し（現構成）

			return "redirect:/admin/" + shopId + "_dashboard/workstation/menu/list";

		} catch (IOException e) {
			model.addAttribute("errorMessage", "画像の保存に失敗しました");
			model.addAttribute("shopId", shopId);
			model.addAttribute("categoryId", categoryId);
			model.addAttribute("subcategoryId", subcategoryId);
			// 再表示に必要なリスト（imageList等）も再セットする
			return "admin/shop_dashboard/workstation/menu/add_item";
		}
	}

	// 大分類編集処理
	@PostMapping("/menu/{categoryId}/edit")
	public String updateCategory(
			@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@RequestParam("categoryName") String categoryName) {

		MenuCategory category = new MenuCategory();
		category.setCategoryId(categoryId);
		category.setCategoryName(categoryName);

		menuMapper.updateCategory(category);
		return "redirect:/admin/" + shopId + "_dashboard/workstation/menu/list";
	}

	// 中分類編集処理
	@PostMapping("/menu/{categoryId}/{subcategoryId}/edit")
	public String updateSubcategory(
			@PathVariable("shopId") int shopId,
			@PathVariable("categoryId") int categoryId,
			@PathVariable("subcategoryId") int subcategoryId,
			@RequestParam("subcategoryName") String subcategoryName) {

		MenuSubcategory subcategory = new MenuSubcategory();
		subcategory.setSubcategoryId(subcategoryId);
		subcategory.setSubcategoryName(subcategoryName);

		menuMapper.updateSubcategory(subcategory);
		return "redirect:/admin/" + shopId + "_dashboard/workstation/menu/list";
	}

}
