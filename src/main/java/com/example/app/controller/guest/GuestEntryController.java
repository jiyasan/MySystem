package com.example.app.controller.guest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.app.entity.Shop;
import com.example.app.mapper.ShopMapper;
import com.example.app.mapper.TableMapper;
import com.example.app.service.CustomerSessionService;
import com.example.app.service.TableService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/guest/{shopId}/entry")
public class GuestEntryController {

	@Autowired
	private TableService tableService;

	@Autowired
	private CustomerSessionService customerSessionService;

	@Autowired
	private TableMapper tableMapper;

	@Autowired
	private ShopMapper shopMapper;

	// 🚪 入店フォームの表示
	@GetMapping("/{tableId}")
	public String showEntryForm(
			@PathVariable("shopId") int shopId,
			@PathVariable("tableId") int tableId,
			Model model) {

		Shop shop = shopMapper.findById(shopId);
		model.addAttribute("shop", shop);

		int actualShopId = tableMapper.findShopIdByTableId(tableId);
		if (actualShopId != shopId) {
			model.addAttribute("errorMessage", "このテーブルは指定された店舗に存在しません");
			model.addAttribute("shopId", shopId);
			model.addAttribute("tableId", tableId);
			return "guest/entry";
		}

		if (!tableService.isValidTable(tableId)) {
			model.addAttribute("errorMessage", "このテーブルは現在ご利用いただけません");
			model.addAttribute("shopId", shopId);
			model.addAttribute("tableId", tableId);
			return "guest/entry";
		}

		model.addAttribute("shopId", shopId);
		model.addAttribute("tableId", tableId);
		return "guest/entry";
	}

	// 📝 入店処理（セッション作成 or 再利用）
	@PostMapping("/start")
	public String startSession(
			@PathVariable("shopId") int shopId,
			@RequestParam("tableId") int tableId,
			@RequestParam("guestCount") int guestCount,
			@RequestParam(name = "nickname", required = false) String nickname,
			HttpServletRequest request,
			HttpServletResponse response,
			RedirectAttributes redirectAttributes) {

		// 整合性チェック
		int actualShopId = tableMapper.findShopIdByTableId(tableId);
		if (actualShopId != shopId) {
			redirectAttributes.addFlashAttribute("errorMessage", "不正なアクセスです");
			return "redirect:/guest/" + shopId + "/entry/" + tableId;
		}

		// 🍪 deviceToken を取得 or 作成
		String deviceToken = getOrCreateDeviceToken(request, response);

		try {
			// ✅ shopId を含めてセッション作成
			String sessionId = customerSessionService.createSession(tableId, guestCount, nickname, deviceToken, shopId);
			return "redirect:/menu/" + sessionId;
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("errorMessage", "入店処理中にエラーが発生しました。店員にお声がけください。");
			return "redirect:/guest/" + shopId + "/entry/" + tableId;
		}
	}

	private String getOrCreateDeviceToken(HttpServletRequest request, HttpServletResponse response) {
		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if ("deviceToken".equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}
		String newToken = java.util.UUID.randomUUID().toString();
		Cookie cookie = new Cookie("deviceToken", newToken);
		cookie.setPath("/");
		cookie.setMaxAge(60 * 60 * 24 * 365);
		response.addCookie(cookie);
		return newToken;
	}
}
