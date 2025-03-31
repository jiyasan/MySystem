package com.example.app.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.entity.Employee;
import com.example.app.mapper.EmployeeMapper;
import com.example.app.service.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeMapper employeeMapper;

    @Override
    public Employee authenticate(String loginId, String loginPass) {
        Employee employee = employeeMapper.findByLoginId(loginId);

        if (employee == null) {
            return null;
        }

        // パスワード照合（例：プレーン or ハッシュ）
        if (employee.getLoginPass().equals(loginPass)) {
            return employee;
        } else {
            return null;
        }
    }
}
