package com.neoshop.model.dto.request;

import com.neoshop.model.entity.Coupon.DiscountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {
  @NotBlank(message = "Coupon code is required")
  private String code;

  @NotNull(message = "Discount type is required")
  private DiscountType discountType;

  @NotNull(message = "Discount value is required")
  @Positive(message = "Discount value must be positive")
  private BigDecimal discountValue;

  private BigDecimal minOrderAmount;
  private Integer maxUsage;
  private LocalDateTime expiryDate;
  private Boolean active;
}
