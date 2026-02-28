package com.neoshop.controller;

import com.neoshop.model.dto.request.ChatMessageRequest;
import com.neoshop.model.dto.response.ChatMessageResponse;
import com.neoshop.model.dto.response.ChatRoomResponse;
import com.neoshop.model.entity.ChatMessage;
import com.neoshop.model.entity.ChatRoom;
import com.neoshop.model.entity.User;
import com.neoshop.repository.UserRepository;
import com.neoshop.service.ChatService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    // ========================
    // API REST
    // ========================

    /**
     * Người dùng: Lấy hoặc tạo phòng chat
     */
    @GetMapping("/api/chat/room")
    public ResponseEntity<Map<String, Object>> getMyRoom(Authentication auth) {
        User user = getUser(auth);
        ChatRoom room = chatService.getOrCreateRoom(user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("roomId", room.getId());
        response.put("userId", room.getUserId());
        response.put("unreadCount", room.getUnreadCountUser());
        return ResponseEntity.ok(response);
    }

    /**
     * Admin: Lấy danh sách tất cả phòng chat
     */
    @GetMapping("/api/chat/rooms")
    public ResponseEntity<List<ChatRoomResponse>> getAllRooms() {
        return ResponseEntity.ok(chatService.getRoomsForAdmin());
    }

    /**
     * Lấy tin nhắn trong phòng chat (có phân trang)
     */
    @GetMapping("/api/chat/rooms/{roomId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getMessages(
            @PathVariable UUID roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(chatService.getMessages(roomId, PageRequest.of(page, size)));
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     */
    @PostMapping("/api/chat/rooms/{roomId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID roomId, Authentication auth) {
        User user = getUser(auth);
        chatService.markAsRead(roomId, user.getId());

        // Thông báo phía đối diện rằng tin nhắn đã được xem
        messagingTemplate.convertAndSend("/topic/chat/" + roomId + "/seen",
                Map.of("userId", user.getId(), "roomId", roomId));

        // Cập nhật danh sách phòng chat cho admin (real-time)
        messagingTemplate.convertAndSend("/topic/chat/rooms", chatService.getRoomsForAdmin());

        return ResponseEntity.ok().build();
    }

    /**
     * Admin: Đánh dấu tất cả đã đọc
     */
    @PostMapping("/api/chat/rooms/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        User user = getUser(auth);
        boolean isAdmin = user.getRoles().stream()
                .map(r -> r.getName().toUpperCase())
                .anyMatch(name -> name.equals("ADMIN") || name.equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(403).build();
        }

        chatService.markAllAsReadForAdmin(user.getId());

        // Cập nhật danh sách phòng chat cho admin (real-time)
        messagingTemplate.convertAndSend("/topic/chat/rooms", chatService.getRoomsForAdmin());

        return ResponseEntity.ok().build();
    }

    /**
     * Lấy số tin nhắn chưa đọc
     */
    @GetMapping("/api/chat/unread")
    public ResponseEntity<Map<String, Integer>> getUnreadCount(Authentication auth) {
        User user = getUser(auth);
        boolean isAdmin = user.getRoles().stream()
                .map(r -> r.getName().toUpperCase())
                .anyMatch(name -> name.equals("ADMIN") || name.equals("ROLE_ADMIN"));

        int count = isAdmin
                ? chatService.getTotalUnreadForAdmin()
                : chatService.getUnreadCountForUser(user.getId());

        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    /**
     * Admin: Xóa cuộc hội thoại
     */
    @DeleteMapping("/api/chat/rooms/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable UUID roomId) {
        chatService.deleteRoom(roomId);
        return ResponseEntity.ok().build();
    }

    // ========================
    // XỬ LÝ WEBSOCKET
    // ========================

    /**
     * Xử lý gửi tin nhắn qua WebSocket
     * Client gửi tới: /app/chat.send/{roomId}
     * Phát sóng tới: /topic/chat/{roomId}
     */
    @MessageMapping("/chat.send/{roomId}")
    public void handleSendMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessageRequest request,
            Authentication auth) {

        UUID roomUuid = UUID.fromString(roomId);

        // Lấy thông tin người gửi từ xác thực
        UUID senderId;
        if (auth != null && auth.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) auth.getPrincipal()).getUsername();
            User sender = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            senderId = sender.getId();
        } else {
            throw new RuntimeException("Chưa xác thực");
        }

        ChatMessage saved = chatService.sendMessage(roomUuid, senderId, request);

        // Tạo response
        ChatMessageResponse response = ChatMessageResponse.builder()
                .id(saved.getId())
                .chatRoomId(saved.getChatRoomId())
                .senderId(saved.getSenderId())
                .senderName(saved.getSenderName())
                .senderAvatar(saved.getSenderAvatar())
                .content(saved.getContent())
                .seen(saved.isSeen())
                .createdAt(saved.getCreatedAt())
                .build();

        // Phát sóng tới tất cả subscriber
        messagingTemplate.convertAndSend("/topic/chat/" + roomId, response);

        // Cập nhật danh sách phòng chat cho admin (real-time)
        messagingTemplate.convertAndSend("/topic/chat/rooms", chatService.getRoomsForAdmin());
    }

    /**
     * Xử lý chỉ báo đang nhập
     * Client gửi tới: /app/chat.typing/{roomId}
     * Phát sóng tới: /topic/chat/{roomId}/typing
     */
    @MessageMapping("/chat.typing/{roomId}")
    public void handleTyping(
            @DestinationVariable String roomId,
            @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/chat/" + roomId + "/typing", payload);
    }

    /**
     * Xử lý trạng thái hiện diện
     * Client gửi tới: /app/chat.status/{roomId}
     * Phát sóng tới: /topic/chat/{roomId}/status
     */
    @MessageMapping("/chat.status/{roomId}")
    public void handleStatus(
            @DestinationVariable String roomId,
            @Payload Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/chat/" + roomId + "/status", payload);
    }

    // ========================
    // HÀM HỖ TRỢ
    // ========================

    private User getUser(Authentication auth) {
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));
    }
}
