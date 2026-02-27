package com.neoshop.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private UUID id;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  private BigDecimal price;

  @Column(name = "sale_price")
  private BigDecimal salePrice;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private Category category;

  @Column(name = "stock_quantity")
  private Integer stockQuantity;

  private String status;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "average_rating")
  @Builder.Default
  private Double averageRating = 0.0;

  @Column(name = "review_count")
  @Builder.Default
  private Integer reviewCount = 0;
}
