package com.ecommerce.order.service;

import com.ecommerce.order.dto.UserDto;
import com.ecommerce.order.dto.LoginRequest;
import com.ecommerce.order.dto.RegisterRequest;

public interface UserService {
    
    UserDto register(RegisterRequest request);
    
    UserDto login(LoginRequest request);
    
    UserDto getUserById(Long userId);
    
    UserDto updateUser(Long userId, UserDto userDto);
}