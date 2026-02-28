import { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiSend,
  FiSmile,
  FiCheck,
  FiCheckCircle,
  FiMessageSquare,
  FiUser,
  FiMoreVertical,
  FiExternalLink,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import chatService from "../../../services/chatService";
import useChat from "../../../hooks/useChat";
import { useAuth } from "../../../context/AuthContext";
import { formatDateTimeShort, formatDate } from "../../../utils/formatDate";
import "./Messages.css";

const ADMIN_QUICK_REPLIES = [
  "Chào bạn, tôi có thể giúp gì?",
  "Đơn hàng của bạn đã được xử lý",
  "Vui lòng chờ trong giây lát",
  "Cảm ơn bạn đã liên hệ!",
  "Tôi sẽ kiểm tra và phản hồi sớm nhất",
];

const Messages = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const selectedRoomRef = useRef(null); // Added this ref
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const navigate = useNavigate();

  const {
    messages,
    setMessages,
    isConnected,
    typingUser,
    sendMessage,
    sendTyping,
  } = useChat(selectedRoom?.id, user?.id);

  // Fetch all rooms & real-time updates
  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 15000);
    return () => clearInterval(interval);
  }, []);

  // Load messages when room selected
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id);
    }
  }, [selectedRoom?.id]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark as read when viewing
  useEffect(() => {
    if (selectedRoom && messages.length > 0) {
      chatService.markAsRead(selectedRoom.id);
    }
  }, [selectedRoom?.id, messages.length]);

  const fetchRooms = async () => {
    try {
      const data = await chatService.getAllRooms();
      const current = selectedRoomRef.current;
      
      // Mark current room as read locally to prevent flickering
      const processed = data.map(room => {
        if (current && room.id === current.id) {
          return { ...room, unreadCount: 0 };
        }
        return room;
      });
      
      setRooms(processed);
    } catch (e) {
      console.error("Failed to fetch rooms:", e);
    } finally {
      setLoadingRooms(false);
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    selectedRoomRef.current = room;
    // Immediate unread reset in UI
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, unreadCount: 0 } : r));
    chatService.markAsRead(room.id);
  };

  const handleMarkAllRead = async () => {
    try {
      // Immediate UI reset for better UX
      setRooms(prev => prev.map(r => ({ ...r, unreadCount: 0 })));
      
      await chatService.markAllAsRead();
      
      // Refresh to ensure we have the latest state from server
      await fetchRooms();
    } catch (e) {
      console.error("Failed to mark all as read:", e);
    }
  };

  const handleMarkCurrentRead = async () => {
    if (!selectedRoom) return;
    try {
      await chatService.markAsRead(selectedRoom.id);
      fetchRooms();
    } catch (e) {
      console.error("Failed to mark current as read:", e);
    }
  };

  const handleViewOrders = () => {
    if (!selectedRoom) return;
    navigate(`/admin/orders?userId=${selectedRoom.userId}`);
  };

  const handleDeleteConversation = async () => {
    if (!selectedRoom) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xoá cuộc trò chuyện với ${selectedRoom.userName}? Hành động này không thể hoàn tác.`)) return;
    
    try {
      await chatService.deleteRoom(selectedRoom.id);
      setSelectedRoom(null);
      fetchRooms();
    } catch (e) {
      console.error("Failed to delete conversation:", e);
      alert("Xoá cuộc trò chuyện thất bại.");
    }
  };


  const loadMessages = async (roomId) => {
    try {
      setLoadingMessages(true);
      const data = await chatService.getMessages(roomId, 0, 100);
      const sorted = [...(data.content || [])].reverse();
      setMessages(sorted);
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !selectedRoom) return;
    sendMessage({ content: input.trim() });
    setInput("");
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const handleQuickReply = (text) => {
    if (!selectedRoom) return;
    sendMessage({ content: text });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => sendTyping(), 300);
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };



  const isMyMessage = (msg) => 
    msg.senderId === user?.id || 
    (msg.senderName && msg.senderName === user?.username);

  const filteredRooms = rooms.filter(
    (r) =>
      !searchQuery ||
      r.userName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ`;
    return formatDate(dateStr);
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Left: Conversation List */}
        <div className="conversations-panel">
          <div className="conv-header">
            <h2>Tin nhắn</h2>
            <div className="conv-header-actions">
              <button 
                className="mark-all-read-btn" 
                onClick={handleMarkAllRead}
                title="Đánh dấu tất cả đã đọc"
              >
                <FiCheckCircle size={14} />
                <span>Đã đọc hết</span>
              </button>
              <span className="conv-count">
                {rooms.filter((r) => r.unreadCount > 0).length} chưa đọc
              </span>
            </div>
          </div>

          <div className="conv-search">
            <FiSearch className="conv-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm hội thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="conv-list">
            {loadingRooms ? (
              <div className="conv-loading">Đang tải...</div>
            ) : filteredRooms.length === 0 ? (
              <div className="conv-empty">
                <FiMessageSquare size={32} />
                <p>Chưa có hội thoại nào</p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className={`conv-item ${selectedRoom?.id === room.id ? "active" : ""} ${room.unreadCount > 0 ? "unread" : ""}`}
                  onClick={() => selectRoom(room)}
                >
                  <div className="conv-avatar">
                    {room.userAvatar ? (
                      <img src={room.userAvatar} alt="" />
                    ) : (
                      <FiUser size={18} />
                    )}
                  </div>
                  <div className="conv-info">
                    <div className="conv-info-top">
                      <span className="conv-name">{room.userName}</span>
                      <span className="conv-time">
                        {getRelativeTime(room.lastMessageAt)}
                      </span>
                    </div>
                    <div className="conv-info-bottom">
                      <span className="conv-preview">
                        {room.lastMessage || "Chưa có tin nhắn"}
                      </span>
                      {room.unreadCount > 0 && (
                        <span className="conv-badge">{room.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Chat Area */}
        <div className="chat-panel">
          {!selectedRoom ? (
            <div className="chat-placeholder">
              <FiMessageSquare size={64} color="#cbd5e1" />
              <h3>Chọn một hội thoại</h3>
              <p>Chọn cuộc trò chuyện từ danh sách bên trái để bắt đầu</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="admin-chat-header">
                <div className="admin-chat-user">
                  <div className="conv-avatar">
                    {selectedRoom.userAvatar ? (
                      <img src={selectedRoom.userAvatar} alt="" />
                    ) : (
                      <FiUser size={18} />
                    )}
                  </div>
                  <div>
                    <div className="admin-chat-name">
                      {selectedRoom.userName}
                    </div>
                  </div>
                </div>
                
                <div className="admin-chat-actions">
                  <button 
                    className="admin-action-btn" 
                    onClick={handleMarkCurrentRead}
                    title="Đánh dấu đã đọc"
                  >
                    <FiCheck size={20} />
                  </button>
                  <div className="admin-user-menu-wrapper">
                    <button 
                      className="admin-action-btn"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <FiMoreVertical size={20} />
                    </button>
                    {showUserMenu && (
                      <div className="admin-user-dropdown">
                        <button onClick={() => { handleViewOrders(); setShowUserMenu(false); }}>
                          <FiExternalLink size={14} />
                          Xem đơn hàng
                        </button>
                        <button className="delete-btn" onClick={() => { handleDeleteConversation(); setShowUserMenu(false); }}>
                          <FiTrash2 size={14} />
                          Xoá hội thoại
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="admin-chat-messages">
                {loadingMessages ? (
                  <div className="chat-loading-center">
                    Đang tải tin nhắn...
                  </div>
                ) : (
                  <>
                    {(() => {
                      const lastMyMsgIndex = messages.reduce((last, m, idx) => isMyMessage(m) ? idx : last, -1);
                      return messages.map((msg, i) => (
                        <div
                          key={msg.id || i}
                          className={`admin-msg ${isMyMessage(msg) ? "mine" : "theirs"}`}
                        >
                          {!isMyMessage(msg) && (
                            <div className="admin-msg-avatar">
                              {msg.senderAvatar ? (
                                <img src={msg.senderAvatar} alt="" />
                              ) : (
                                <FiUser size={14} />
                              )}
                            </div>
                          )}
                          <div className="admin-msg-content">
                            <div className="admin-msg-bubble">
                              <span>{msg.content}</span>
                            </div>
                            <div className="admin-msg-meta">
                              <span>{formatDateTimeShort(msg.createdAt)}</span>
                              {isMyMessage(msg) && msg.seen && i === lastMyMsgIndex && (
                                <span className="admin-msg-seen-text">
                                  • Đã xem
                                </span>
                              )}
                              {isMyMessage(msg) && !msg.seen && (
                                <span className="admin-msg-sent-status">
                                  <FiCheck size={11} />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ));
                    })()}

                    {typingUser && (
                      <div className="admin-msg theirs">
                        <div className="admin-msg-avatar">
                          <FiUser size={14} />
                        </div>
                        <div className="admin-msg-bubble typing-indicator">
                          <span className="typing-dot-anim">
                            <span></span>
                            <span></span>
                            <span></span>
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Quick Replies */}
              <div className="admin-quick-replies">
                {ADMIN_QUICK_REPLIES.map((text, i) => (
                  <button
                    key={i}
                    className="admin-qr-btn"
                    onClick={() => handleQuickReply(text)}
                  >
                    {text}
                  </button>
                ))}
              </div>

              {/* Emoji Picker */}
              {showEmoji && (
                <div className="admin-emoji-picker">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width="100%"
                    height={280}
                    searchDisabled
                    skinTonesDisabled
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              )}

              {/* Input */}
              <div className="admin-chat-input">
                <button
                  className={`admin-input-btn ${showEmoji ? "active" : ""}`}
                  onClick={() => setShowEmoji(!showEmoji)}
                >
                  <FiSmile size={18} />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="admin-text-input"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="admin-send-btn"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <FiSend size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
