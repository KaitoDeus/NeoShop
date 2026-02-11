package com.neoshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal salePrice;
    private String categoryName;
    private UUID categoryId;
    private Integer stockQuantity;
    private String status;
    private LocalDateTime createdAt;
}
