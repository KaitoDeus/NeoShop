package com.neoshop.service;

import com.neoshop.repository.OrderRepository;
import com.neoshop.repository.ProductRepository;
import com.neoshop.repository.UserRepository;
import com.neoshop.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long activeProducts = productRepository.count();

        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalRevenue", totalRevenue);
        stats.put("activeProducts", activeProducts);

        stats.put("paymentStats", getPaymentStats());
        stats.put("categoryStats", getCategoryRevenue());
        stats.put("topProducts", getTopProducts(5));

        return stats;
    }

    public List<Map<String, Object>> getCategoryRevenue() {
        List<Object[]> results = orderItemRepository.getRevenueByCategory();
        List<Map<String, Object>> stats = new ArrayList<>();

        String[] colors = { "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#475569" };
        int colorIdx = 0;

        for (Object[] row : results) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", row[0]);
            item.put("value", row[1]);
            item.put("color", colors[colorIdx % colors.length]);
            stats.add(item);
            colorIdx++;
        }
        return stats;
    }

    public List<Map<String, Object>> getTopProducts(int limit) {
        List<Object[]> results = orderItemRepository.getTopSellingProducts();
        List<Map<String, Object>> stats = new ArrayList<>();

        int count = 0;
        for (Object[] row : results) {
            if (count >= limit)
                break;
            Map<String, Object> item = new HashMap<>();
            item.put("name", row[0]);
            item.put("sold", row[1]);
            stats.add(item);
            count++;
        }
        return stats;
    }

    public List<Map<String, Object>> getPaymentStats() {
        List<Object[]> results = orderRepository.countOrdersByStatus();
        List<Map<String, Object>> paymentStats = new ArrayList<>();

        long success = 0;
        long failed = 0;
        long pending = 0;

        for (Object[] row : results) {
            String status = (String) row[0];
            Long count = (Long) row[1];

            if ("PAID".equals(status) || "COMPLETED".equals(status)) {
                success += count;
            } else if ("CANCELLED".equals(status) || "FAILED".equals(status)) {
                failed += count;
            } else {
                pending += count;
            }
        }

        Map<String, Object> successMap = new HashMap<>();
        successMap.put("name", "Thành công");
        successMap.put("value", success);
        paymentStats.add(successMap);

        Map<String, Object> failedMap = new HashMap<>();
        failedMap.put("name", "Thất bại");
        failedMap.put("value", failed);
        paymentStats.add(failedMap);

        if (pending > 0) {
            Map<String, Object> pendingMap = new HashMap<>();
            pendingMap.put("name", "Chờ xử lý");
            pendingMap.put("value", pending);
            paymentStats.add(pendingMap);
        }

        return paymentStats;
    }

    public List<Map<String, Object>> getRevenueChartData() {
        List<Map<String, Object>> chartData = new ArrayList<>();
        LocalDate today = LocalDate.now();
        String[] dayNames = { "CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7" };

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

            BigDecimal dailyRevenue = orderRepository.sumRevenueBetween(startOfDay, endOfDay);
            if (dailyRevenue == null) {
                dailyRevenue = BigDecimal.ZERO;
            }

            int dayOfWeek = date.getDayOfWeek().getValue();
            String name = dayNames[dayOfWeek % 7];

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("name", name);
            point.put("value", dailyRevenue);
            chartData.add(point);
        }

        return chartData;
    }

    public List<Map<String, Object>> getMonthlyStats() {
        List<Map<String, Object>> monthlyStats = new ArrayList<>();
        LocalDate now = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            LocalDateTime startOfMonth = monthDate.withDayOfMonth(1).atStartOfDay();
            LocalDateTime endOfMonth = monthDate.withDayOfMonth(monthDate.lengthOfMonth()).atTime(LocalTime.MAX);

            BigDecimal revenue = orderRepository.sumRevenueBetween(startOfMonth, endOfMonth);
            if (revenue == null)
                revenue = BigDecimal.ZERO;

            Map<String, Object> monthRow = new LinkedHashMap<>();
            monthRow.put("month", "Tháng " + monthDate.getMonthValue());
            monthRow.put("revenue", revenue);
            monthRow.put("expense", revenue.multiply(new BigDecimal("0.7"))); // Mock expense as 70% of revenue
            monthRow.put("profit", revenue.multiply(new BigDecimal("0.3"))); // Mock profit as 30% of revenue
            monthRow.put("orders", 0);
            monthRow.put("status", "completed");

            monthlyStats.add(monthRow);
        }

        return monthlyStats;
    }
}
