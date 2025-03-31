package com.example.app.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.app.entity.Employee;

@Mapper
public interface EmployeeMapper {

    @Select("SELECT * FROM employees WHERE login_id = #{loginId}")
    Employee findByLoginId(String loginId);
}
