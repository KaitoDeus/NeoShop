package com.neoshop.service;

import com.neoshop.model.dto.request.OrderRequest;
import com.neoshop.model.dto.response.OrderResponse;
import com.neoshop.model.entity.Order;
import com.neoshop.model.entity.OrderItem;
import com.neoshop.model.entity.Product;
import com.neoshop.model.entity.User;
import com.neoshop.model.entity.Coupon;
import com.neoshop.repository.OrderRepository;
import com.neoshop.repository.ProductRepository;
import com.neoshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final com.neoshop.repository.ProductKeyRepository productKeyRepository;
    private final CouponService couponService;

    @Transactional
    public OrderResponse createOrder(UUID userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .user(user)
                .status("PENDING")
                .paymentMethod(request.getPaymentMethod())
                .shippingAddress(request.getShippingAddress())
                .orderDate(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getTitle());
            }

            // Update stock
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getSalePrice() != null ? product.getSalePrice() : product.getPrice())
                    .build();

            order.getItems().add(orderItem);
            totalAmount = totalAmount
                    .add(orderItem.getUnitPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
        }

        order.setTotalAmount(totalAmount);

        // Apply coupon if provided
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponService.validateCoupon(request.getCouponCode(), totalAmount);
            BigDecimal discount = couponService.calculateDiscount(coupon, totalAmount);
            order.setCouponCode(request.getCouponCode());
            order.setDiscountAmount(discount);
            order.setTotalAmount(totalAmount.subtract(discount));
            couponService.incrementUsage(coupon);
        }

        Order savedOrder = orderRepository.save(order);

        return mapToResponse(savedOrder);
    }

    public Page<OrderResponse> getOrdersByUser(UUID userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable).map(this::mapToResponse);
    }

    public OrderResponse getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String oldStatus = order.getStatus();
        order.setStatus(status);
        Order savedOrder = orderRepository.save(order);

        // Logic gán key khi đơn hàng được thanh toán
        if (("PAID".equals(status) || "COMPLETED".equals(status)) && !"PAID".equals(oldStatus)
                && !"COMPLETED".equals(oldStatus)) {
            assignKeysToOrder(savedOrder);
        }

        return mapToResponse(savedOrder);
    }

    private void assignKeysToOrder(Order order) {
        for (OrderItem item : order.getItems()) {
            List<com.neoshop.model.entity.ProductKey> availableKeys = productKeyRepository.findAvailableKeysByProduct(
                    item.getProduct().getId(),
                    org.springframework.data.domain.PageRequest.of(0, item.getQuantity()));

            if (availableKeys.size() < item.getQuantity()) {
                // Trong thực tế, cần có cơ chế xử lý khi thiếu key (thông báo admin, hoàn
                // tiền...)
                throw new RuntimeException("Not enough keys available for product: " + item.getProduct().getTitle());
            }

            for (com.neoshop.model.entity.ProductKey key : availableKeys) {
                key.setStatus(com.neoshop.model.entity.ProductKey.KeyStatus.SOLD);
                key.setOrderId(order.getId());
            }
            productKeyRepository.saveAll(availableKeys);
        }
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .shippingAddress(order.getShippingAddress())
                .orderDate(order.getOrderDate())
                .items(order.getItems().stream().map(item -> OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productTitle(item.getProduct().getTitle())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
