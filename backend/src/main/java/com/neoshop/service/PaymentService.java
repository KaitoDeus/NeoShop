package com.neoshop.service;

import com.neoshop.model.dto.request.PaymentRequest;
import com.neoshop.model.dto.response.PaymentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final OrderService orderService;
    private final Random random = new Random();

    /**
     * Mock Payment Gateway — Simulate payment processing.
     * 90% chance of SUCCESS, 10% chance of FAILED.
     */
    public PaymentResponse processPayment(PaymentRequest request) {
        // 1. Validate order exists
        orderService.getOrderById(request.getOrderId());

        // 2. Simulate processing
        boolean success = random.nextInt(100) < 90;

        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        if (success) {
            // Update order status to PAID
            orderService.updateOrderStatus(request.getOrderId(), "PAID");

            return PaymentResponse.builder()
                    .transactionId(transactionId)
                    .orderId(request.getOrderId())
                    .status("SUCCESS")
                    .message("Thanh toán thành công qua " + request.getPaymentMethod())
                    .processedAt(LocalDateTime.now())
                    .build();
        } else {
            // Update order status to FAILED
            orderService.updateOrderStatus(request.getOrderId(), "FAILED");

            return PaymentResponse.builder()
                    .transactionId(transactionId)
                    .orderId(request.getOrderId())
                    .status("FAILED")
                    .message("Thanh toán thất bại. Vui lòng thử lại.")
                    .processedAt(LocalDateTime.now())
                    .build();
        }
    }
}
