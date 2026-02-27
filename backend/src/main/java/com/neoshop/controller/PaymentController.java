package com.neoshop.controller;

import com.neoshop.model.dto.request.PaymentRequest;
import com.neoshop.model.dto.response.PaymentResponse;
import com.neoshop.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Gateway", description = "APIs xử lý thanh toán (Mock)")
public class PaymentController {

  private final PaymentService paymentService;
  private final com.neoshop.service.VNPayService vnPayService;
  private final com.neoshop.service.MoMoService moMoService;
  private final com.neoshop.service.OrderService orderService;

  @PostMapping("/process")
  @Operation(summary = "Xử lý thanh toán cho đơn hàng")
  public ResponseEntity<PaymentResponse> processPayment(
      @jakarta.validation.Valid @RequestBody PaymentRequest request) {
    return ResponseEntity.ok(paymentService.processPayment(request));
  }

  @org.springframework.web.bind.annotation.GetMapping("/vnpay/ipn")
  @Operation(summary = "VNPay IPN Callback (Backend to Backend)")
  public ResponseEntity<java.util.Map<String, Object>> vnpayIpn(jakarta.servlet.http.HttpServletRequest request) {
    return ResponseEntity.ok(vnPayService.processIpn(request, orderService));
  }

  @org.springframework.web.bind.annotation.GetMapping("/vnpay/return")
  @Operation(summary = "VNPay Return Callback (User Browser Redirect)")
  public ResponseEntity<Void> vnpayReturn(jakarta.servlet.http.HttpServletRequest request) {
    String orderId = request.getParameter("vnp_TxnRef");

    // Ở môi trường dev/demo, ta có thể gọi IPN logic tại đây luôn để đảm bảo đơn
    // hàng được cập nhật
    // trước khi user quay về trang thành công.
    vnPayService.processIpn(request, orderService);

    String redirectUrl = "http://localhost:5173";

    // Luôn luôn đưa người dùng về trang Order Success. Ở đó React sẽ dựa vào
    // trạng thái 'FAILED' hoặc 'PAID' của đơn để báo lỗi hoặc thành công.
    String vnpResponseCode = request.getParameter("vnp_ResponseCode");
    redirectUrl += "/order-success/" + orderId + "?vnp_ResponseCode="
        + (vnpResponseCode != null ? vnpResponseCode : "");

    return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
        .location(java.net.URI.create(redirectUrl))
        .build();
  }

  @org.springframework.web.bind.annotation.GetMapping("/momo/return")
  @Operation(summary = "MoMo Return Callback (User Browser Redirect)")
  public ResponseEntity<Void> momoReturn(jakarta.servlet.http.HttpServletRequest request) {
    String orderId = request.getParameter("orderId");
    String resultCodeStr = request.getParameter("resultCode");
    System.out.println("MoMo Return: orderId=" + orderId + ", resultCode=" + resultCodeStr);

    if (orderId != null && resultCodeStr != null) {
      try {
        int resultCode = Integer.parseInt(resultCodeStr);
        java.util.UUID uuid = java.util.UUID.fromString(orderId);
        if (resultCode == 0) {
          orderService.updateOrderStatus(uuid, "PAID");
        } else {
          orderService.updateOrderStatus(uuid, "FAILED");
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    String redirectUrl = "http://localhost:5173/";

    return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
        .location(java.net.URI.create(redirectUrl))
        .build();
  }

  @PostMapping("/momo/ipn")
  @Operation(summary = "MoMo IPN Callback (Backend to Backend)")
  public ResponseEntity<java.util.Map<String, Object>> momoIpn(@RequestBody java.util.Map<String, Object> requestBody) {
    return ResponseEntity.ok(moMoService.processIpn(requestBody, orderService));
  }
}
