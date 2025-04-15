package com.example.app;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan({
    "com.example.app.mapper",
    "com.example.app.viewer.menu.mapper"
})
public class MySystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(MySystemApplication.class, args);
	}

}
