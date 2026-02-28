package com.neoshop.repository;

import com.neoshop.model.entity.ChatMessage;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    Page<ChatMessage> findByChatRoomIdOrderByCreatedAtDesc(UUID chatRoomId, Pageable pageable);

    List<ChatMessage> findByChatRoomIdOrderByCreatedAtAsc(UUID chatRoomId);

    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true)
    @org.springframework.data.jpa.repository.Query("UPDATE ChatMessage m SET m.seen = true WHERE m.chatRoomId = :roomId AND m.senderId != :userId AND m.seen = false")
    int markMessagesAsRead(@org.springframework.data.repository.query.Param("roomId") java.util.UUID roomId,
            @org.springframework.data.repository.query.Param("userId") java.util.UUID userId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ChatMessage m SET m.seen = true WHERE m.senderId != :userId AND m.seen = false")
    void markAllMessagesAsRead(@Param("userId") UUID userId);

    void deleteByChatRoomId(UUID chatRoomId);
}
