package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CustomerNicknameMapper {
	
	List<String> findUsedColorsBySessionId(@Param("sessionId") String sessionId);

	void insertNickname(
			@Param("sessionId") String sessionId,
			@Param("deviceToken") String deviceToken,
			@Param("nickname") String nickname,
			@Param("colorCode") String colorCode);
}
