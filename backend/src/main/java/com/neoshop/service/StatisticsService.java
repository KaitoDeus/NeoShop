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

        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(order -> "PAID".equals(order.getStatus()) || "COMPLETED".equals(order.getStatus()))
                .map(order -> order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalRevenue", totalRevenue);
        stats.put("activeProducts", activeProducts);

        return stats;
    }

    public List<Map<String, Object>> getRevenueChartData() {
        List<Map<String, Object>> chartData = new ArrayList<>();
        LocalDate today = LocalDate.now();
        String[] dayNames = { "CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7" };

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

            BigDecimal dailyRevenue = orderRepository.findAll().stream()
                    .filter(order -> order.getOrderDate() != null
                            && !order.getOrderDate().isBefore(startOfDay)
                            && !order.getOrderDate().isAfter(endOfDay))
                    .filter(order -> "PAID".equals(order.getStatus()) || "COMPLETED".equals(order.getStatus()))
                    .map(order -> order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            int dayOfWeek = date.getDayOfWeek().getValue(); // 1=Mon ... 7=Sun
            String name = dayNames[dayOfWeek % 7];

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("name", name);
            point.put("value", dailyRevenue);
            chartData.add(point);
        }

        return chartData;
    }
}
