package com.example.app.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.app.dto.LayoutItem;
import com.example.app.entity.Shop;
import com.example.app.entity.Table;
import com.example.app.mapper.ShopLayoutMapper;
import com.example.app.mapper.ShopMapper;
import com.example.app.mapper.TableMapper;

@Controller
@RequestMapping("/admin/{shopId}_dashboard/layout")
public class ShopLayoutController {

	@Autowired
	private ShopLayoutMapper shopLayoutMapper;

	@Autowired
	private TableMapper tableMapper;
	
	@Autowired
	private ShopMapper shopMapper;

	// 編集画面の表示
	@GetMapping("/edit")
	public String showLayoutEditor(@PathVariable("shopId") int shopId, Model model) {
		List<LayoutItem> layoutItems = shopLayoutMapper.findByShopId(shopId); // 使用中のみ
	    Shop shop = shopMapper.findById(shopId); // ← ★ここがポイント

		model.addAttribute("shopId", shopId);
		model.addAttribute("layoutItems", layoutItems); // ← これを渡す！

		// ✅ 使用中テーブル（is_deleted = false）
		List<LayoutItem> usedTables = shopLayoutMapper.findByShopId(shopId);
		model.addAttribute("usedTables", usedTables);
	    model.addAttribute("shop", shop); // ← ★これでテンプレートで使える

		// ✅ 非表示テーブル（is_deleted = true）
		List<LayoutItem> hiddenTables = shopLayoutMapper.findHiddenByShopId(shopId);
		model.addAttribute("hiddenTables", hiddenTables);
	    model.addAttribute("shop", shop); // ← ★これでテンプレートで使える

		return "admin/shop_dashboard/layout/edit";
	}

	// 配置確定 → 保存処理（JSONで受け取る）
	@PostMapping("/save")
	@ResponseBody
	public String saveLayout(
			@PathVariable("shopId") int shopId,
			@RequestBody List<LayoutItem> layoutItems) {

		// ① 既存レイアウトは論理削除
		shopLayoutMapper.logicalDeleteByShopId(shopId);

		for (LayoutItem item : layoutItems) {
			// ② upsert（INSERT or UPDATE）
			shopLayoutMapper.upsert(shopId, item);

			// ③ type=table の場合は tables テーブルへ
			if ("table".equals(item.getType())) {
				Table existing = tableMapper.findByShopIdAndName(shopId, item.getName());

				if (existing == null) {
					// 新規作成
					Table newTable = new Table();
					newTable.setShopId(shopId);
					newTable.setTableName(item.getName());
					newTable.setStatus(0);
					newTable.setIsDeleted(false);
					tableMapper.insert(newTable);
				} else if (existing.getIsDeleted()) {
					// 復活
					tableMapper.revive(shopId, item.getName());
				}
			}
		}

		return "OK";
	}

}
