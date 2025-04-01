package com.example.app.entity;

import lombok.Data;

@Data
public class Shop {
    private Integer shopId;
    private String shopName;
    private String address;
    private String phone;
    private String businessHours;
    private String holidays;
    private String message;
    private String mapUrl;
    private String logoImage;
}
