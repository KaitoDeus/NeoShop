package com.neoshop.controller;

import com.neoshop.model.dto.request.LoginRequest;
import com.neoshop.model.dto.response.AuthResponse;
import com.neoshop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "APIs cho Đăng nhập và Đăng ký")
@lombok.extern.slf4j.Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống", description = "Trả về JWT Token nếu đăng nhập thành công")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        log.info("Received login request for user: {}", request.getUsername());
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsername(), e);
            return ResponseEntity.status(401).body("Login failed: " + e.getMessage());
        }
    }
}
