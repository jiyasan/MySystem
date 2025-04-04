package com.example.app.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.app.dto.LayoutItem;
import com.example.app.entity.Table;
import com.example.app.mapper.ShopLayoutMapper;
import com.example.app.mapper.TableMapper;

@Controller
@RequestMapping("/admin/{shopId}_dashboard/layout")
public class LayoutController {
	
	@Autowired
	private ShopLayoutMapper shopLayoutMapper;
	
	@Autowired
	private TableMapper tableMapper;

	// 編集画面の表示
	@GetMapping("/edit")
	public String showLayoutEditor(@PathVariable("shopId") int shopId, Model model) {
		model.addAttribute("shopId", shopId);
		return "admin/shop_dashboard/layout/edit";
	}

	// 配置確定 → 保存処理（JSONで受け取る）
	@PostMapping("/save")
	@ResponseBody
	public String saveLayout(
			@PathVariable("shopId") int shopId,
			@RequestBody List<LayoutItem> layoutItems) {
		
		// ① 対象店舗のレイアウトを全削除
		shopLayoutMapper.deleteByShopId(shopId);
		tableMapper.deleteByShopId(shopId); // オプション：再生成型なら必要

		// ② データを再登録
		for (LayoutItem item : layoutItems) {
			// レイアウト（shop_layouts）へ
			shopLayoutMapper.insert(shopId, item);

			// テーブル（tables）へ：typeが "table" の場合のみ
			if ("table".equals(item.getType())) {
				try {
					Table table = new Table();
					table.setShopId(shopId);
					table.setTableName(item.getName());
					table.setStatus(0);
					table.setIsDeleted(false);
					tableMapper.insert(table);
				} catch (DuplicateKeyException e) {
					System.out.println("重複スキップ: " + item.getName());
				}
			}
		}

		return "OK";
	}

}
