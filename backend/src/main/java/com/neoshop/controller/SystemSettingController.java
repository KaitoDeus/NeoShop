package com.neoshop.controller;

import com.neoshop.service.SystemSettingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
@Tag(name = "System Settings", description = "Quản lý cấu hình hệ thống")
@PreAuthorize("hasRole('ADMIN')")
public class SystemSettingController {
    private final SystemSettingService settingService;

    @GetMapping
    @Operation(summary = "Lấy tất cả cấu hình hệ thống")
    public ResponseEntity<Map<String, String>> getAllSettings() {
        return ResponseEntity.ok(settingService.getAllSettings());
    }

    @PostMapping
    @Operation(summary = "Cập nhật cấu hình hệ thống")
    public ResponseEntity<Void> updateSettings(@RequestBody Map<String, String> settings) {
        settingService.updateSettings(settings);
        return ResponseEntity.ok().build();
    }
}
