package com.example.app.controller.admin;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.imageio.ImageIO;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/menu/image")
public class ImageDisplayController {

	@GetMapping("/display/{shopId}/{filename:.+}")
	public ResponseEntity<byte[]> displayImage(
			@PathVariable int shopId,
			@PathVariable String filename) {

		try {
			Path imagePath = Paths.get("uploads/menu/" + shopId + "/" + filename);
			if (!Files.exists(imagePath)) {
				// 共通画像として再探索
				imagePath = Paths.get("uploads/menu/0/" + filename);
				if (!Files.exists(imagePath)) {
					return ResponseEntity.notFound().build();
				}
			}

			BufferedImage original = ImageIO.read(imagePath.toFile());
			int width = original.getWidth();
			int height = original.getHeight();
			int size = Math.max(width, height);

			// 正方形のキャンバス（透過対応）
			BufferedImage square = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
			Graphics2D g2d = square.createGraphics();
			g2d.setComposite(AlphaComposite.Clear);
			g2d.fillRect(0, 0, size, size);
			g2d.setComposite(AlphaComposite.SrcOver);

			int x = (size - width) / 2;
			int y = (size - height) / 2;
			g2d.drawImage(original, x, y, null);
			g2d.dispose();

			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ImageIO.write(square, "png", baos);
			byte[] imageBytes = baos.toByteArray();

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.IMAGE_PNG);

			return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);

		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
