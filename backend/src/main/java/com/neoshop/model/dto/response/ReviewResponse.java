package com.neoshop.model.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private UUID id;
    private UUID productId;
    private UUID userId;
    private String userName;
    private String userAvatar;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
