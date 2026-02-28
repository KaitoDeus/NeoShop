package com.neoshop.service;

import com.neoshop.model.dto.request.ChatMessageRequest;
import com.neoshop.model.dto.response.ChatMessageResponse;
import com.neoshop.model.dto.response.ChatRoomResponse;
import com.neoshop.model.entity.ChatMessage;
import com.neoshop.model.entity.ChatRoom;
import com.neoshop.model.entity.User;
import com.neoshop.repository.ChatMessageRepository;
import com.neoshop.repository.ChatRoomRepository;
import com.neoshop.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    /**
     * Lấy hoặc tạo phòng chat cho người dùng
     */
    public ChatRoom getOrCreateRoom(UUID userId) {
        return chatRoomRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

                    ChatRoom room = ChatRoom.builder()
                            .userId(userId)
                            .userName(user.getFullName() != null ? user.getFullName() : user.getUsername())
                            .userAvatar(user.getAvatar())
                            .build();
                    return chatRoomRepository.save(room);
                });
    }

    /**
     * Gửi tin nhắn trong phòng chat
     */
    @Transactional
    public ChatMessage sendMessage(UUID roomId, UUID senderId, ChatMessageRequest request) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng chat"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        boolean isAdmin = sender.getRoles().stream()
                .map(r -> r.getName().toUpperCase())
                .anyMatch(name -> name.equals("ADMIN") || name.equals("ROLE_ADMIN"));

        ChatMessage message = ChatMessage.builder()
                .chatRoomId(roomId)
                .senderId(senderId)
                .senderName(sender.getFullName() != null ? sender.getFullName() : sender.getUsername())
                .senderAvatar(sender.getAvatar())
                .content(request.getContent())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);

        // Cập nhật metadata phòng chat
        String preview = request.getContent();
        room.setLastMessagePreview(preview != null && preview.length() > 100 ? preview.substring(0, 100) : preview);
        room.setLastMessageAt(LocalDateTime.now());

        // Tăng số tin chưa đọc cho phía đối diện
        if (isAdmin) {
            room.setUnreadCountUser(room.getUnreadCountUser() + 1);
        } else {
            room.setUnreadCountAdmin(room.getUnreadCountAdmin() + 1);
        }

        chatRoomRepository.save(room);
        return saved;
    }

    /**
     * Lấy tin nhắn trong phòng chat (có phân trang, mới nhất trước)
     */
    public Page<ChatMessageResponse> getMessages(UUID roomId, Pageable pageable) {
        return chatMessageRepository.findByChatRoomIdOrderByCreatedAtDesc(roomId, pageable)
                .map(this::toResponse);
    }

    /**
     * Lấy danh sách phòng chat cho admin
     */
    public List<ChatRoomResponse> getRoomsForAdmin() {
        return chatRoomRepository.findAllByOrderByLastMessageAtDesc().stream()
                .map(room -> ChatRoomResponse.builder()
                        .id(room.getId())
                        .userId(room.getUserId())
                        .userName(room.getUserName())
                        .userAvatar(room.getUserAvatar())
                        .lastMessage(room.getLastMessagePreview())
                        .lastMessageAt(room.getLastMessageAt())
                        .unreadCount(room.getUnreadCountAdmin())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     */
    @Transactional
    public void markAsRead(UUID roomId, UUID userId) {
        // 1. Đánh dấu tất cả tin nhắn đã xem trong bảng Message
        chatMessageRepository.markMessagesAsRead(roomId, userId);

        // 2. Reset số đếm chưa đọc trong bảng Room bằng SQL trực tiếp
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            boolean isAdmin = user.getRoles().stream()
                    .map(r -> r.getName().toUpperCase())
                    .anyMatch(name -> name.equals("ADMIN") || name.equals("ROLE_ADMIN"));

            if (isAdmin) {
                chatRoomRepository.resetAdminUnreadCount(roomId);
            } else {
                chatRoomRepository.resetUserUnreadCountInRoom(roomId);
            }
        }
    }

    /**
     * Đánh dấu tất cả tin nhắn đã đọc cho admin
     */
    @Transactional
    public void markAllAsReadForAdmin(UUID adminId) {
        // 1. Đánh dấu tất cả tin nhắn đã xem
        chatMessageRepository.markAllMessagesAsRead(adminId);

        // 2. Reset tất cả số đếm chưa đọc cho admin
        chatRoomRepository.resetAllAdminUnreadCounts();
    }

    /**
     * Lấy số tin chưa đọc cho người dùng
     */
    public int getUnreadCountForUser(UUID userId) {
        return chatRoomRepository.findByUserId(userId)
                .map(ChatRoom::getUnreadCountUser)
                .orElse(0);
    }

    /**
     * Lấy tổng số tin chưa đọc cho admin
     */
    public int getTotalUnreadForAdmin() {
        return chatRoomRepository.findAllByOrderByLastMessageAtDesc().stream()
                .mapToInt(ChatRoom::getUnreadCountAdmin)
                .sum();
    }

    /**
     * Xóa phòng chat và tất cả tin nhắn
     */
    @Transactional
    public void deleteRoom(UUID roomId) {
        chatMessageRepository.deleteByChatRoomId(roomId);
        chatRoomRepository.deleteById(roomId);
    }

    private ChatMessageResponse toResponse(ChatMessage msg) {
        return ChatMessageResponse.builder()
                .id(msg.getId())
                .chatRoomId(msg.getChatRoomId())
                .senderId(msg.getSenderId())
                .senderName(msg.getSenderName())
                .senderAvatar(msg.getSenderAvatar())
                .content(msg.getContent())
                .seen(msg.isSeen())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
