package com.neoshop.controller;

import com.neoshop.model.dto.request.PaymentRequest;
import com.neoshop.model.dto.response.PaymentResponse;
import com.neoshop.service.MoMoService;
import com.neoshop.service.OrderService;
import com.neoshop.service.PaymentService;
import com.neoshop.service.VNPayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Gateway", description = "APIs xử lý thanh toán")
public class PaymentController {

  private final PaymentService paymentService;
  private final VNPayService vnPayService;
  private final MoMoService moMoService;
  private final OrderService orderService;

  @PostMapping("/process")
  @Operation(summary = "Xử lý thanh toán cho đơn hàng")
  public ResponseEntity<PaymentResponse> processPayment(
      @Valid @RequestBody PaymentRequest request) {
    return ResponseEntity.ok(paymentService.processPayment(request));
  }

  @GetMapping("/vnpay/ipn")
  @Operation(summary = "VNPay IPN Callback (Server-to-Server)")
  public ResponseEntity<Map<String, Object>> vnpayIpn(HttpServletRequest request) {
    return ResponseEntity.ok(vnPayService.processIpn(request, orderService));
  }

  @GetMapping("/vnpay/return")
  @Operation(summary = "VNPay Return - Chuyển hướng người dùng sau thanh toán")
  public ResponseEntity<Void> vnpayReturn(HttpServletRequest request) {
    String orderId = request.getParameter("vnp_TxnRef");

    // Xử lý IPN tại đây để đảm bảo đơn hàng được cập nhật trước khi chuyển hướng
    vnPayService.processIpn(request, orderService);

    String redirectUrl = "http://localhost:5173";
    String vnpResponseCode = request.getParameter("vnp_ResponseCode");
    redirectUrl += "/order-success/" + orderId + "?vnp_ResponseCode="
        + (vnpResponseCode != null ? vnpResponseCode : "");

    return ResponseEntity.status(HttpStatus.FOUND)
        .location(URI.create(redirectUrl))
        .build();
  }

  @GetMapping("/momo/return")
  @Operation(summary = "MoMo Return - Chuyển hướng người dùng sau thanh toán")
  public ResponseEntity<Void> momoReturn(HttpServletRequest request) {
    String orderId = request.getParameter("orderId");
    String resultCodeStr = request.getParameter("resultCode");

    if (orderId != null && resultCodeStr != null) {
      try {
        int resultCode = Integer.parseInt(resultCodeStr);
        UUID uuid = UUID.fromString(orderId);
        if (resultCode == 0) {
          orderService.updateOrderStatus(uuid, "PAID");
        } else {
          orderService.updateOrderStatus(uuid, "FAILED");
        }
      } catch (Exception e) {
        log.error("Lỗi xử lý MoMo Return: {}", e.getMessage());
      }
    }

    String redirectUrl = "http://localhost:5173/";

    return ResponseEntity.status(HttpStatus.FOUND)
        .location(URI.create(redirectUrl))
        .build();
  }

  @PostMapping("/momo/ipn")
  @Operation(summary = "MoMo IPN Callback (Server-to-Server)")
  public ResponseEntity<Map<String, Object>> momoIpn(@RequestBody Map<String, Object> requestBody) {
    return ResponseEntity.ok(moMoService.processIpn(requestBody, orderService));
  }
}
