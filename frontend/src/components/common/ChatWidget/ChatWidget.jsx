import { useState, useEffect, useRef } from "react";
import {
  FiMessageSquare,
  FiX,
  FiSend,
  FiSmile,
  FiCheck,
} from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "../../../context/AuthContext";
import chatService from "../../../services/chatService";
import useChat from "../../../hooks/useChat";
import { formatDateTimeShort } from "../../../utils/formatDate";
import "./ChatWidget.css";

const QUICK_REPLIES = [
  "Xin chào, tôi cần hỗ trợ",
  "Kiểm tra đơn hàng",
  "Hỏi về sản phẩm",
  "Khiếu nại / Hoàn tiền",
];

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const {
    messages,
    setMessages,
    isConnected,
    typingUser,
    userStatus,
    sendMessage,
    sendTyping,
    sendStatus,
  } = useChat(roomId, user?.id);

  // Presence tracking
  useEffect(() => {
    if (!isConnected || !roomId) return;

    // Send ONLINE when connected
    sendStatus("ONLINE");

    const handleVisibilityChange = () => {
      sendStatus(document.visibilityState === "visible" ? "ONLINE" : "AWAY");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isConnected, roomId, sendStatus]);

  // Get or create room on open
  useEffect(() => {
    if (isOpen && user && !roomId) {
      initRoom();
    }
  }, [isOpen, user]);

  // Mark as read when opened
  useEffect(() => {
    if (isOpen && roomId) {
      chatService.markAsRead(roomId);
      setUnreadCount(0);
    }
  }, [isOpen, roomId, messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch unread count periodically
  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const data = await chatService.getUnreadCount();
        if (!isOpen) setUnreadCount(data.unreadCount);
      } catch (e) {
        // ignore
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user, isOpen]);

  const initRoom = async () => {
    try {
      setLoadingHistory(true);
      const room = await chatService.getMyRoom();
      setRoomId(room.roomId);

      // Load history
      const history = await chatService.getMessages(room.roomId, 0, 50);
      const sorted = [...(history.content || [])].reverse();
      setMessages(sorted);
    } catch (e) {
      console.error("Failed to init chat room:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !roomId) return;
    sendMessage({
      content: input.trim(),
    });
    setInput("");
    setShowEmoji(false);
  };

  const handleQuickReply = (text) => {
    if (!roomId) return;
    sendMessage({
      content: text,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Send typing indicator (debounced)
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      sendTyping();
    }, 300);
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const isMyMessage = (msg) => 
    msg.senderId === user?.id || 
    (msg.senderName && msg.senderName === user?.username);

  if (!user) return null;

  return (
    <div className="chat-widget-container">
      {/* Floating Button */}
      {!isOpen && (
        <button className="chat-fab" onClick={() => setIsOpen(true)}>
          <FiMessageSquare size={24} />
          {unreadCount > 0 && (
            <span className="chat-fab-badge">{unreadCount}</span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-admin-avatar">NS</div>
              <div>
                <div className="chat-header-name">NeoShop Support</div>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <FiX size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {loadingHistory ? (
              <div className="chat-loading">Đang tải tin nhắn...</div>
            ) : messages.length === 0 ? (
              <div className="chat-empty">
                <div className="chat-empty-icon">💬</div>
                <p>Xin chào! Bạn cần hỗ trợ gì?</p>
                <div className="quick-replies">
                  {QUICK_REPLIES.map((text, i) => (
                    <button
                      key={i}
                      className="quick-reply-btn"
                      onClick={() => handleQuickReply(text)}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {(() => {
                  const lastMyMsgIndex = messages.reduce((last, m, idx) => isMyMessage(m) ? idx : last, -1);
                  return messages.map((msg, i) => (
                    <div
                      key={msg.id || i}
                      className={`chat-message ${isMyMessage(msg) ? "mine" : "theirs"}`}
                    >
                      {!isMyMessage(msg) && (
                        <div className="msg-avatar-small">
                          {msg.senderAvatar ? (
                            <img src={msg.senderAvatar} alt="" />
                          ) : (
                            "NS"
                          )}
                        </div>
                      )}
                      <div className="msg-bubble-wrapper">
                        <div className="msg-bubble">
                          <span>{msg.content}</span>
                        </div>
                        <div className="msg-meta">
                          <span className="msg-time">
                            {formatDateTimeShort(msg.createdAt)}
                          </span>
                          {isMyMessage(msg) && (
                            <span className="msg-status">
                              {msg.seen && i === lastMyMsgIndex ? (
                                <span className="seen-text">Đã xem</span>
                              ) : !msg.seen ? (
                                <FiCheck size={12} color="#94a3b8" />
                              ) : null}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ));
                })()}

                {/* Typing indicator */}
                {typingUser && (
                  <div className="chat-message theirs">
                    <div className="msg-avatar-small">NS</div>
                    <div className="msg-bubble typing-bubble">
                      <span className="typing-dots">
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

          {/* Quick Replies (when there are messages) */}
          {messages.length > 0 && (
            <div className="quick-replies-bar">
              {QUICK_REPLIES.slice(0, 2).map((text, i) => (
                <button
                  key={i}
                  className="quick-reply-sm"
                  onClick={() => handleQuickReply(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="emoji-picker-container">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                height={300}
                searchDisabled
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-bar">
            <button
              className={`chat-action-btn ${showEmoji ? "active" : ""}`}
              onClick={() => setShowEmoji(!showEmoji)}
              title="Emoji"
            >
              <FiSmile size={18} />
            </button>
            <input
              ref={inputRef}
              type="text"
              className="chat-text-input"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
