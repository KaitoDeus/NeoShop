package com.neoshop.repository;

import com.neoshop.model.entity.ChatRoom;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
    Optional<ChatRoom> findByUserId(UUID userId);

    List<ChatRoom> findAllByOrderByLastMessageAtDesc();

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true)
    @org.springframework.data.jpa.repository.Query("UPDATE ChatRoom r SET r.unreadCountAdmin = 0 WHERE r.id = :roomId")
    void resetAdminUnreadCount(@org.springframework.data.repository.query.Param("roomId") java.util.UUID roomId);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true)
    @org.springframework.data.jpa.repository.Query("UPDATE ChatRoom r SET r.unreadCountAdmin = 0")
    void resetAllAdminUnreadCounts();

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true)
    @org.springframework.data.jpa.repository.Query("UPDATE ChatRoom r SET r.unreadCountUser = 0 WHERE r.id = :roomId")
    void resetUserUnreadCountInRoom(@org.springframework.data.repository.query.Param("roomId") java.util.UUID roomId);
}
