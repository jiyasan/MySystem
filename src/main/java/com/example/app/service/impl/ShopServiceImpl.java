package com.example.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.entity.Shop;
import com.example.app.mapper.ShopMapper;
import com.example.app.service.ShopService;

@Service
public class ShopServiceImpl implements ShopService {

    @Autowired
    private ShopMapper shopMapper;

    @Override
    public List<Shop> findAll() {
        return shopMapper.findAll(); // mapperに任せる
    }

    @Override
    public boolean isShopNameDuplicate(String shopName) {
        return shopMapper.countByShopName(shopName) > 0;
    }

    @Override
    public void addShop(String shopName) {
        Shop shop = new Shop();
        shop.setShopName(shopName);
        shopMapper.insertShop(shop);
    }

    @Override
    public int countByShopName(String shopName) {
        return shopMapper.countByShopName(shopName); // ← 追加
    }

    @Override
    public void insertShop(Shop shop) {
        shopMapper.insertShop(shop); // ← 追加
    }
}
