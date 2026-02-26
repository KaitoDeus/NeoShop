package com.neoshop.service;

import com.neoshop.model.entity.Coupon;
import com.neoshop.repository.CouponRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CouponService {
  private final CouponRepository couponRepository;

  public List<Coupon> getAllCoupons() {
    return couponRepository.findAll();
  }

  public Coupon createCoupon(com.neoshop.model.dto.request.CouponRequest request) {
    if (couponRepository.findByCode(request.getCode()).isPresent()) {
      throw new RuntimeException("Mã giảm giá đã tồn tại: " + request.getCode());
    }
    Coupon coupon =
        Coupon.builder()
            .code(request.getCode())
            .discountType(request.getDiscountType())
            .discountValue(request.getDiscountValue())
            .minOrderAmount(request.getMinOrderAmount())
            .maxUsage(request.getMaxUsage())
            .expiryDate(request.getExpiryDate())
            .active(request.getActive() != null ? request.getActive() : true)
            .currentUsage(0)
            .build();
    return couponRepository.save(coupon);
  }

  public Coupon updateCoupon(UUID id, com.neoshop.model.dto.request.CouponRequest request) {
    Coupon coupon =
        couponRepository.findById(id).orElseThrow(() -> new RuntimeException("Coupon not found"));

    coupon.setCode(request.getCode());
    coupon.setDiscountType(request.getDiscountType());
    coupon.setDiscountValue(request.getDiscountValue());
    coupon.setMinOrderAmount(request.getMinOrderAmount());
    coupon.setMaxUsage(request.getMaxUsage());
    coupon.setExpiryDate(request.getExpiryDate());
    if (request.getActive() != null) {
      coupon.setActive(request.getActive());
    }

    return couponRepository.save(coupon);
  }

  public void deleteCoupon(UUID id) {
    couponRepository.deleteById(id);
  }

  /** Validate a coupon code against an order amount. */
  public Coupon validateCoupon(String code, BigDecimal orderAmount) {
    Coupon coupon =
        couponRepository
            .findByCode(code)
            .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

    if (!coupon.getActive()) {
      throw new RuntimeException("Mã giảm giá đã bị vô hiệu hóa");
    }

    if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
      throw new RuntimeException("Mã giảm giá đã hết hạn");
    }

    if (coupon.getMaxUsage() != null && coupon.getCurrentUsage() >= coupon.getMaxUsage()) {
      throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");
    }

    if (coupon.getMinOrderAmount() != null
        && orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
      throw new RuntimeException(
          "Đơn hàng tối thiểu " + coupon.getMinOrderAmount() + " để sử dụng mã này");
    }

    return coupon;
  }

  /** Calculate the discount amount for a given coupon and order total. */
  public BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
    if (coupon.getDiscountType() == Coupon.DiscountType.PERCENT) {
      return orderAmount
          .multiply(coupon.getDiscountValue())
          .divide(BigDecimal.valueOf(100), 0, RoundingMode.FLOOR);
    } else {
      // FIXED discount — cannot exceed order amount
      return coupon.getDiscountValue().min(orderAmount);
    }
  }

  /** Increment usage count after successful application. */
  public void incrementUsage(Coupon coupon) {
    coupon.setCurrentUsage(coupon.getCurrentUsage() + 1);
    couponRepository.save(coupon);
  }
}
