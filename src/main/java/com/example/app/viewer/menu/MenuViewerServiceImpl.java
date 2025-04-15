package com.example.app.viewer.menu;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.app.viewer.menu.dto.MenuViewerItemDTO;
import com.example.app.viewer.menu.dto.MenuViewerResponseDTO;
import com.example.app.viewer.menu.dto.MenuViewerSubcategoryDTO;
import com.example.app.viewer.menu.mapper.MenuViewerMapper;

@Service
public class MenuViewerServiceImpl implements MenuViewerService {

	private final MenuViewerMapper menuViewerMapper;

	public MenuViewerServiceImpl(MenuViewerMapper menuViewerMapper) {
		this.menuViewerMapper = menuViewerMapper;
	}

	@Override
	public MenuViewerResponseDTO getMenuByCategoryId(int categoryId) {
	    List<MenuViewerSubcategoryDTO> subcategories = menuViewerMapper.findSubcategoriesByCategoryId(categoryId);
	    List<MenuViewerItemDTO> items = menuViewerMapper.findVisibleMenuItemsByCategoryId(categoryId);
	    return new MenuViewerResponseDTO(subcategories, items);
	}

}
