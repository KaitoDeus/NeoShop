package com.neoshop.controller;

import com.neoshop.model.dto.request.OrderRequest;
import com.neoshop.model.dto.response.OrderResponse;
import com.neoshop.model.entity.User;
import com.neoshop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "APIs cho quản lý đơn hàng")
public class OrderController {
  private final OrderService orderService;
  private final com.neoshop.repository.UserRepository userRepository;
  private final com.neoshop.service.VNPayService vnPayService;
  private final com.neoshop.service.MoMoService moMoService;

  @PostMapping
  @Operation(summary = "Tạo đơn hàng mới")
  public ResponseEntity<OrderResponse> createOrder(
      java.security.Principal principal,
      jakarta.servlet.http.HttpServletRequest httpRequest,
      @jakarta.validation.Valid @RequestBody OrderRequest request) {
    User user = userRepository
        .findByUsername(principal.getName())
        .orElseThrow(() -> new RuntimeException("User not found"));
    OrderResponse response = orderService.createOrder(user.getId(), request);

    if ("VNPAY".equals(request.getPaymentMethod())) {
      try {
        String paymentUrl = vnPayService.createPaymentUrl(response.getId(), response.getTotalAmount().longValue(),
            "Thanh toan don hang " + response.getId(), httpRequest);
        response.setPaymentUrl(paymentUrl);
      } catch (Exception e) {
        e.printStackTrace();
      }
    } else if ("MOMO".equals(request.getPaymentMethod())) {
      try {
        String paymentUrl = moMoService.createPaymentUrl(response.getId(), response.getTotalAmount().longValue(),
            "Thanh toan don hang " + response.getId());
        response.setPaymentUrl(paymentUrl);
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    return ResponseEntity.ok(response);
  }

  @GetMapping("/my-orders")
  @Operation(summary = "Lấy lịch sử đơn hàng của người dùng hiện tại")
  public ResponseEntity<Page<OrderResponse>> getMyOrders(
      java.security.Principal principal,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    User user = userRepository
        .findByUsername(principal.getName())
        .orElseThrow(() -> new RuntimeException("User not found"));
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(orderService.getOrdersByUser(user.getId(), pageable));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Lấy chi tiết đơn hàng theo ID")
  public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID id) {
    return ResponseEntity.ok(orderService.getOrderById(id));
  }

  @PatchMapping("/{id}/status")
  @Operation(summary = "Cập nhật trạng thái đơn hàng (Admin)")
  public ResponseEntity<OrderResponse> updateStatus(
      @PathVariable UUID id, @RequestParam String status) {
    return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
  }
}
