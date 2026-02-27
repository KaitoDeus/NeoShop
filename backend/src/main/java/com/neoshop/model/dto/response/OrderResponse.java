package com.neoshop.model.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
  private UUID id;
  private UUID userId;
  private String username;
  private String fullName;
  private String userEmail;
  private BigDecimal totalAmount;
  private String status;
  private String paymentMethod;
  private String shippingAddress;
  private LocalDateTime orderDate;
  private String paymentUrl;
  private List<OrderItemResponse> items;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class OrderItemResponse {
    private UUID id;
    private UUID productId;
    private String productTitle;
    private Integer quantity;
    private BigDecimal unitPrice;
  }
}
