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
	public Employee authenticate(String loginId, String pass) {
		Employee employee = employeeMapper.findByLoginId(loginId);

		// nullチェックを追加して安全に比較！
		if (employee != null && employee.getPassword() != null && employee.getPassword().equals(pass)) {
			return employee;
		}
		return null;
	}

}
