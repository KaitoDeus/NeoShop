package com.neoshop.model.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductKeyResponse {
  private UUID id;
  private UUID productId;
  private String productTitle;
  private String keyCode;
  private String status;
  private UUID orderId;
  private LocalDateTime createdAt;
}
