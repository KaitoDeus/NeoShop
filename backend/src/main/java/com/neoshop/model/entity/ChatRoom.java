package com.neoshop.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    private String userName;
    private String userAvatar;

    private UUID adminId;

    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;

    @Column(length = 500)
    private String lastMessagePreview;

    @Builder.Default
    private int unreadCountAdmin = 0;

    @Builder.Default
    private int unreadCountUser = 0;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastMessageAt = LocalDateTime.now();
    }
}
