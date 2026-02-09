package com.neoshop.auth.controller;

import com.neoshop.auth.entity.User;
import com.neoshop.auth.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs cho quản lý người dùng và xác thực")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Lấy danh sách người dùng (Phân trang)", description = "Hỗ trợ kiểm tra hiệu năng trên 1 triệu dòng dữ liệu")
    public Page<User> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userRepository.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết người dùng theo ID")
    public User getUserById(@PathVariable UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm người dùng theo Email")
    public User getUserByEmail(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
