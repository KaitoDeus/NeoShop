package com.neoshop.controller;

import com.neoshop.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard", description = "APIs cung cấp dữ liệu thống kê cho trang quản trị")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {
    private final StatisticsService statisticsService;

    @GetMapping("/stats")
    @Operation(summary = "Lấy chỉ số thống kê tổng quan")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(statisticsService.getDashboardStats());
    }
}
