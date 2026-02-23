package com.neoshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductKeyResponse {
    private UUID id;
    private UUID productId;
    private String keyCode;
    private String status;
    private UUID orderId;
}
