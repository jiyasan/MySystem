package com.example.app.controller.guest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.app.dto.MenuItemDTO;
import com.example.app.entity.CustomerNickname;
import com.example.app.entity.CustomerSession;
import com.example.app.entity.MenuCategory;
import com.example.app.entity.MenuSubcategory;
import com.example.app.entity.Shop;
import com.example.app.mapper.CustomerNicknameMapper;
import com.example.app.mapper.CustomerSessionMapper;
import com.example.app.mapper.MenuMapper;
import com.example.app.mapper.ShopMapper;

@Controller
@RequestMapping("/menu")
public class GuestMenuController {

	@Autowired
	private CustomerSessionMapper customerSessionMapper;

	@Autowired
	private CustomerNicknameMapper nicknameMapper;

	@Autowired
	private ShopMapper shopMapper;

	@Autowired
	private MenuMapper menuMapper;

	@GetMapping("/{sessionId}")
	public String showMenu(@PathVariable("sessionId") String sessionId,
			@CookieValue(value = "deviceToken", required = false) String deviceToken,
			Model model) {
		// セッション取得
		CustomerSession session = customerSessionMapper.findById(sessionId);
		if (session == null) {
			model.addAttribute("errorMessage", "有効なセッションが見つかりませんでした。");
			return "guest/error";
		}

		int tableId = session.getTableId();
		int shopId = session.getShopId();

		// 店情報
		Shop shop = shopMapper.findById(shopId);
		if (shop == null) {
			model.addAttribute("errorMessage", "店舗情報が見つかりませんでした。");
			return "guest/error";
		}

		// メニュー構成
		List<MenuItemDTO> items = menuMapper.findAllItemDTOsByShopId(shopId);
		List<MenuCategory> categories = menuMapper.findAllCategoriesByShopId(shopId);
		List<MenuSubcategory> subcategories = menuMapper.findAllSubcategoriesByShopId(shopId);

		Map<Integer, List<MenuItemDTO>> itemsBySubcategory = items.stream()
				.collect(Collectors.groupingBy(MenuItemDTO::getItemSubcategory));

		// ニックネーム（端末ごとに分岐）
		CustomerNickname nickObj = (deviceToken != null)
				? nicknameMapper.findNicknameBySessionIdAndDeviceToken(sessionId, deviceToken)
				: null;

		String nickname = (nickObj != null) ? nickObj.getNickname() : null;
		String colorCode = (nickObj != null) ? nickObj.getColorCode() : "#999"; // ← fallbackカラー

		// モデルに追加
		model.addAttribute("shop", shop);
		model.addAttribute("itemsBySubcategory", itemsBySubcategory);
		model.addAttribute("sessionId", sessionId);
		model.addAttribute("tableId", tableId);
		model.addAttribute("guestCount", session.getGuestCount());
		model.addAttribute("nickname", nickname);
		model.addAttribute("nicknameColor", colorCode);
		model.addAttribute("categories", categories);
		model.addAttribute("subcategories", subcategories);
		model.addAttribute("items", items);

		return "guest/menu";
	}
}
