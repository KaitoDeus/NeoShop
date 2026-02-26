package com.neoshop.model.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
  private String transactionId;
  private UUID orderId;
  private String status; // SUCCESS, FAILED
  private String message;
  private LocalDateTime processedAt;
}
