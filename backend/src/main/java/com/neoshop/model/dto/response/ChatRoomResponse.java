package com.neoshop.model.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatRoomResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private String userAvatar;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private int unreadCount;
}
