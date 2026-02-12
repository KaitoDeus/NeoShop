package com.neoshop.controller;

import com.neoshop.model.entity.Coupon;
import com.neoshop.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Coupon Management", description = "APIs quản lý mã giảm giá")
public class CouponController {
    private final CouponService couponService;

    // --- Public API ---

    @PostMapping("/api/coupons/validate")
    @Operation(summary = "Kiểm tra mã giảm giá (Public)")
    public ResponseEntity<Map<String, Object>> validateCoupon(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        BigDecimal orderAmount = new BigDecimal(body.get("orderAmount").toString());

        Coupon coupon = couponService.validateCoupon(code, orderAmount);
        BigDecimal discount = couponService.calculateDiscount(coupon, orderAmount);

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "code", coupon.getCode(),
                "discountType", coupon.getDiscountType().name(),
                "discountValue", coupon.getDiscountValue(),
                "discountAmount", discount,
                "finalAmount", orderAmount.subtract(discount)));
    }

    // --- Admin APIs ---

    @GetMapping("/api/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Danh sách tất cả mã giảm giá (Admin)")
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PostMapping("/api/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tạo mã giảm giá mới (Admin)")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.createCoupon(coupon));
    }

    @DeleteMapping("/api/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa mã giảm giá (Admin)")
    public ResponseEntity<Void> deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
