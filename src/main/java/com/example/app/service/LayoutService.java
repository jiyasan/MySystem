package com.example.app.service;

import java.util.List;

import com.example.app.dto.LayoutItem;

public interface LayoutService {
    List<LayoutItem> getLayoutWithStatus(int shopId);
}
