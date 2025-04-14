package com.example.app.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
			insertNicknameIfPresent(existing.getCustomerSessionsId(), nickname, deviceToken);
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
		session.setShopId(shopId); // ✅ 追加

		customerSessionMapper.insert(session);

		insertNicknameIfPresent(sessionId, nickname, deviceToken);
		return sessionId;
	}

	private void insertNicknameIfPresent(String sessionId, String nickname, String deviceToken) {
		if (nickname != null && !nickname.trim().isEmpty()) {
			String colorCode = chooseColorAvoidingDuplicates(sessionId);
			nicknameMapper.insertNickname(sessionId, deviceToken, nickname, colorCode);
		}
	}

	private String generateSessionId(int tableId) {
		String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss"));
		return "table" + tableId + "_" + timestamp;
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
}
