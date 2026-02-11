package com.neoshop.service;

import com.neoshop.model.dto.event.OrderPlacedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    @KafkaListener(topics = "order-placed-topic", groupId = "neoshop-group")
    public void handleOrderPlacedNotification(OrderPlacedEvent event) {
        log.info("🔔 NHẬN THÔNG BÁO MỚI TỪ KAFKA");
        log.info("Gửi email xác nhận đơn hàng thành công:");
        log.info("To: {} ({})", event.getCustomerEmail(), event.getCustomerName());
        log.info("Order ID: {}", event.getOrderId());
        log.info("Tổng thanh toán: {} VND", event.getTotalAmount());
        log.info("Trạng thái: {}", event.getStatus());
        log.info("------------------------------------------");
        
        // Trong thực tế, đây là nơi gọi MailService để gửi email thật
    }
}
