package com.neoshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @jakarta.validation.constraints.NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @jakarta.validation.constraints.NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    private String couponCode;

    @jakarta.validation.constraints.NotEmpty(message = "Order must have items")
    private List<OrderItemRequest> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        @jakarta.validation.constraints.NotNull(message = "ProductId is required")
        private UUID productId;

        @jakarta.validation.constraints.Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
