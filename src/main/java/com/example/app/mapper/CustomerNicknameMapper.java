package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.entity.CustomerNickname;

@Mapper
public interface CustomerNicknameMapper {

	// 🌱 ニックネーム登録
	void insertNickname(
			@Param("sessionId") String sessionId,
			@Param("deviceToken") String deviceToken,
			@Param("nickname") String nickname,
			@Param("colorCode") String colorCode);
	
	void updateNickname(
		    @Param("sessionId") String sessionId,
		    @Param("deviceToken") String deviceToken,
		    @Param("nickname") String nickname,
		    @Param("colorCode") String colorCode
		);

	// 🎨 使用済みカラー一覧取得
	List<String> findUsedColorsBySessionId(@Param("sessionId") String sessionId);

	// （任意）セッション内の全ニックネームを取得（確認用）
	List<CustomerNickname> findBySessionId(@Param("sessionId") String sessionId);

	// 👤 再登録防止チェック
	CustomerNickname findNicknameBySessionIdAndDeviceToken(
			@Param("sessionId") String sessionId,
			@Param("deviceToken") String deviceToken);
}