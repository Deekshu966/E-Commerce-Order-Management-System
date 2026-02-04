package com.ecommerce.order.controller;

import com.ecommerce.order.dto.AuthResponse;
import com.ecommerce.order.dto.LoginRequest;
import com.ecommerce.order.dto.RegisterRequest;
import com.ecommerce.order.dto.UserDto;
import com.ecommerce.order.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserDto user = userService.register(request);
        AuthResponse response = AuthResponse.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        UserDto user = userService.login(request);
        AuthResponse response = AuthResponse.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .build();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }
    
    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(userId, userDto));
    }
}