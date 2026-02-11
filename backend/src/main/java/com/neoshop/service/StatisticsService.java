package com.neoshop.service;

import com.neoshop.repository.OrderRepository;
import com.neoshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Thống kê đơn giản (Trong thực tế nên dùng JPQL hoặc Native Query để tối ưu)
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        
        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(order -> "PAID".equals(order.getStatus()) || "COMPLETED".equals(order.getStatus()))
                .map(order -> order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalRevenue", totalRevenue);
        stats.put("activeProducts", 150); // Mock
        
        return stats;
    }
}
