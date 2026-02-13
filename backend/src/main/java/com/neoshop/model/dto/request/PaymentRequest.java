package com.neoshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    @jakarta.validation.constraints.NotNull(message = "Order ID is required")
    private UUID orderId;

    @jakarta.validation.constraints.NotBlank(message = "Payment method is required")
    private String paymentMethod; // MOMO, BANK, VISA, COD
}
