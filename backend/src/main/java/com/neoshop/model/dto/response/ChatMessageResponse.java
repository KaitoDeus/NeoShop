package com.neoshop.model.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessageResponse {
    private UUID id;
    private UUID chatRoomId;
    private UUID senderId;
    private String senderName;
    private String senderAvatar;
    private String content;
    private boolean seen;
    private LocalDateTime createdAt;
}
