package com.example.app.config;

import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// アップロードされた画像を「/uploads/**」のURLで公開
		String uploadPath = Paths.get(System.getProperty("user.dir"), "uploads").toUri().toString();

		registry.addResourceHandler("/uploads/**")
				.addResourceLocations(uploadPath)
				.setCachePeriod(3600); // キャッシュ時間（秒）
	}
}
