package com.neoshop.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false)
    private BigDecimal discountValue;

    @Column(name = "min_order_amount")
    private BigDecimal minOrderAmount;

    @Column(name = "max_usage")
    private Integer maxUsage;

    @Column(name = "current_usage")
    @Builder.Default
    private Integer currentUsage = 0;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Builder.Default
    private Boolean active = true;

    public enum DiscountType {
        PERCENT,
        FIXED
    }
}
