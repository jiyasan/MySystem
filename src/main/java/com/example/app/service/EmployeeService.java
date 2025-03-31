package com.example.app.service;

import com.example.app.entity.Employee;

public interface EmployeeService {
    Employee authenticate(String loginId, String loginPass);
}
