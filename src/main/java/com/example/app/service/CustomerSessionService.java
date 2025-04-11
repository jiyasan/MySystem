package com.example.app.service;

public interface CustomerSessionService {
	String createSession(int tableId, int guestCount, String nickname, String deviceToken);
}
