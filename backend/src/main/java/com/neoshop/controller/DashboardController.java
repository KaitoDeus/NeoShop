package com.neoshop.controller;

import com.neoshop.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

  @GetMapping("/revenue-chart")
  @Operation(summary = "Lấy dữ liệu biểu đồ doanh thu 7 ngày gần nhất")
  public ResponseEntity<List<Map<String, Object>>> getRevenueChart() {
    return ResponseEntity.ok(statisticsService.getRevenueChartData());
  }

  @GetMapping("/monthly-stats")
  @Operation(summary = "Lấy dữ liệu tài chính theo tháng")
  public ResponseEntity<List<Map<String, Object>>> getMonthlyStats() {
    return ResponseEntity.ok(statisticsService.getMonthlyStats());
  }
}
