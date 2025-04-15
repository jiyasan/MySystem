package com.example.app.service;

public interface CustomerSessionService {
	String createSession(int tableId, int guestCount, String nickname, String deviceToken, int shopId);

	// 🆕 追加メソッド
	String findOngoingSessionByTableAndDeviceToken(int tableId, String deviceToken);

	String findOngoingSessionByTable(int tableId);

	void registerAdditionalGuest(String sessionId, String nickname, String deviceToken);
}
