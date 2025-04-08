package com.example.app.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.app.mapper.MenuMapper;

@Controller
@RequestMapping("/admin/{shopId}_dashboard/workstation")
public class AdminMenuController {

    @Autowired
    private MenuMapper menuMapper;


}
