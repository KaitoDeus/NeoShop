package com.neoshop.service;

import com.neoshop.repository.OrderRepository;
import com.neoshop.repository.ProductRepository;
import com.neoshop.repository.UserRepository;
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

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long activeProducts = productRepository.count();

        // Optimized with JPQL
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalRevenue", totalRevenue);
        stats.put("activeProducts", activeProducts);

        // Add payment stats
        stats.put("paymentStats", getPaymentStats());

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

        // Return as chart data format generally
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

            // Optimized with JPQL
            BigDecimal dailyRevenue = orderRepository.sumRevenueBetween(startOfDay, endOfDay);
            if (dailyRevenue == null) {
                dailyRevenue = BigDecimal.ZERO;
            }

            int dayOfWeek = date.getDayOfWeek().getValue(); // 1=Mon ... 7=Sun
            // Adjust for array index: Sun=0, Mon=1...Sat=6 -> dayOfWeek%7
            // Java DayOfWeek: 1 (Mon) -> 7 (Sun)
            // My array: 0=CN (Sun), 1=Mon ...
            // If dayOfWeek=7 (Sun), 7%7 = 0 -> CN. Correct.
            // If dayOfWeek=1 (Mon), 1%7 = 1 -> Thứ 2. Correct.
            String name = dayNames[dayOfWeek % 7];

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("name", name);
            point.put("value", dailyRevenue);
            chartData.add(point);
        }

        return chartData;
    }
}
