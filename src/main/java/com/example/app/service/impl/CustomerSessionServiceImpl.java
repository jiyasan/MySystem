package com.example.app.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.entity.CustomerNickname;
import com.example.app.entity.CustomerSession;
import com.example.app.mapper.CustomerNicknameMapper;
import com.example.app.mapper.CustomerSessionMapper;
import com.example.app.service.CustomerSessionService;

@Service
public class CustomerSessionServiceImpl implements CustomerSessionService {

	@Autowired
	private CustomerSessionMapper customerSessionMapper;

	@Autowired
	private CustomerNicknameMapper nicknameMapper;

	@Override
	public String createSession(int tableId, int guestCount, String nickname, String deviceToken, int shopId) {
		CustomerSession existing = customerSessionMapper.findUnpaidByTableId(tableId);
		if (existing != null) {
			insertNicknameAuto(existing.getCustomerSessionsId(), nickname, deviceToken);
			System.out.println("[DEBUG] セッションすでに存在: " + existing.getCustomerSessionsId());
			return existing.getCustomerSessionsId();
		}

		String sessionId = generateSessionId(tableId);

		CustomerSession session = new CustomerSession();
		session.setCustomerSessionsId(sessionId);
		session.setTableId(tableId);
		session.setGuestCount(guestCount);
		session.setStartedAt(LocalDateTime.now());
		session.setEndedAt(null);
		session.setIsPaid(false);
		session.setTotalAmount(0);
		session.setNote(null);
		session.setShopId(shopId);

		customerSessionMapper.insert(session);
		System.out.println("[DEBUG] セッション作成: " + sessionId);

		insertNicknameAuto(sessionId, nickname, deviceToken);
		return sessionId;
	}

	private void insertNicknameAuto(String sessionId, String nickname, String deviceToken) {
		String effectiveNickname = (nickname == null || nickname.trim().isEmpty())
				? "ゲスト" + generateShortId()
				: nickname;

		String colorCode = chooseColorAvoidingDuplicates(sessionId);
		nicknameMapper.insertNickname(sessionId, deviceToken, effectiveNickname, colorCode);

		System.out.println(
				"[DEBUG] ニックネーム登録: " + effectiveNickname + " / token: " + deviceToken + " / session: " + sessionId);
	}

	private String generateSessionId(int tableId) {
		String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss"));
		return "table" + tableId + "_" + timestamp;
	}

	private String generateShortId() {
		return UUID.randomUUID().toString().substring(0, 5);
	}

	private static final String[] COLOR_CHOICES = {
			"#F44336", "#2196F3", "#4CAF50", "#FFEB3B",
			"#9C27B0", "#E91E63", "#00BCD4", "#FF9800"
	};

	private String chooseColorAvoidingDuplicates(String sessionId) {
		List<String> usedColors = nicknameMapper.findUsedColorsBySessionId(sessionId);
		List<String> unusedColors = Arrays.stream(COLOR_CHOICES)
				.filter(color -> !usedColors.contains(color))
				.collect(Collectors.toList());

		List<String> source = unusedColors.isEmpty() ? Arrays.asList(COLOR_CHOICES) : unusedColors;
		int index = (int) (Math.random() * source.size());
		return source.get(index);
	}

	@Override
	public String findOngoingSessionByTableAndDeviceToken(int tableId, String deviceToken) {
		CustomerSession session = customerSessionMapper.findUnpaidByTableId(tableId);
		System.out.println("[DEBUG] findOngoingSessionByTableAndDeviceToken: deviceToken=" + deviceToken);
		if (session == null) {
			System.out.println("[DEBUG] → session is null");
			return null;
		}

		String sessionId = session.getCustomerSessionsId();
		System.out.println("[DEBUG] → session found: " + sessionId);

		// 👇 修正点：nicknameの有無に関係なく sessionId を返す
		CustomerNickname nickname = nicknameMapper.findNicknameBySessionIdAndDeviceToken(sessionId, deviceToken);
		if (nickname != null) {
			System.out.println("[DEBUG] → nickname already registered for this token: " + nickname.getNickname());
		} else {
			System.out.println("[DEBUG] → nickname not registered for this token.");
		}

		return sessionId;
	}

	@Override
	public String findOngoingSessionByTable(int tableId) {
		CustomerSession session = customerSessionMapper.findUnpaidByTableId(tableId);
		System.out.println("[DEBUG] findOngoingSessionByTable: tableId=" + tableId + " → session="
				+ (session != null ? session.getCustomerSessionsId() : "null"));
		return session != null ? session.getCustomerSessionsId() : null;
	}

	@Override
	public void registerAdditionalGuest(String sessionId, String nickname, String deviceToken) {
		CustomerNickname existing = nicknameMapper.findNicknameBySessionIdAndDeviceToken(sessionId, deviceToken);
		if (existing == null) {
			String effectiveNickname = (nickname == null || nickname.trim().isEmpty())
					? "ゲスト" + generateShortId()
					: nickname;
			String colorCode = chooseColorAvoidingDuplicates(sessionId);
			nicknameMapper.insertNickname(sessionId, deviceToken, effectiveNickname, colorCode);

			System.out.println("[DEBUG] → 追加ゲスト登録: " + effectiveNickname + " / token: " + deviceToken + " / session: "
					+ sessionId);
		} else {
			System.out.println("[DEBUG] → すでに登録済みのゲスト: " + existing.getNickname());
		}
	}
}
