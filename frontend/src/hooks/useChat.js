import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = "http://localhost:8080/ws";

/**
 * Custom hook for real-time chat via WebSocket (STOMP over SockJS)
 */
const useChat = (roomId, currentUserId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [seenUpdate, setSeenUpdate] = useState(null);
  const [userStatus, setUserStatus] = useState(null); // {userId, status}
  const clientRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Connect to WebSocket
  useEffect(() => {
    if (!roomId) return;

    const userString = localStorage.getItem("neoshop_user");
    let token = null;
    if (userString) {
      try {
        const user = JSON.parse(userString);
        token = user?.token;
      } catch (e) {
        console.error("Failed to parse user token");
      }
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setIsConnected(true);

        // Subscribe to messages
        client.subscribe(`/topic/chat/${roomId}`, (message) => {
          const msg = JSON.parse(message.body);
          setMessages((prev) => [...prev, msg]);
        });

        // Subscribe to typing
        client.subscribe(`/topic/chat/${roomId}/typing`, (message) => {
          const data = JSON.parse(message.body);
          if (data.userId !== currentUserId) {
            setTypingUser(data);
            // Clear typing after 3s
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
          }
        });

        // Subscribe to seen
        client.subscribe(`/topic/chat/${roomId}/seen`, (message) => {
          const data = JSON.parse(message.body);
          setSeenUpdate(data);
          // Mark all messages from current user as seen
          if (data.userId !== currentUserId) {
            setMessages((prev) =>
              prev.map((m) =>
                m.senderId === currentUserId ? { ...m, seen: true } : m,
              ),
            );
          }
        });

        // Subscribe to status
        client.subscribe(`/topic/chat/${roomId}/status`, (message) => {
          const data = JSON.parse(message.body);
          if (data.userId !== currentUserId) {
            setUserStatus(data);
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (clientRef.current && clientRef.current.connected) {
        // Try to send OFFLINE before actual disconnect
        clientRef.current.publish({
          destination: `/app/chat.status/${roomId}`,
          body: JSON.stringify({ userId: currentUserId, status: "OFFLINE" }),
        });
        clientRef.current.deactivate();
      }
    };
  }, [roomId, currentUserId]);

  // Send status (ONLINE, AWAY, OFFLINE)
  const sendStatus = useCallback(
    (status) => {
      if (clientRef.current && clientRef.current.connected && roomId) {
        clientRef.current.publish({
          destination: `/app/chat.status/${roomId}`,
          body: JSON.stringify({
            userId: currentUserId,
            status: status,
          }),
        });
      }
    },
    [roomId, currentUserId],
  );

  // Send a message
  const sendMessage = useCallback(
    (request) => {
      if (clientRef.current && clientRef.current.connected && roomId) {
        clientRef.current.publish({
          destination: `/app/chat.send/${roomId}`,
          body: JSON.stringify(request),
        });
      }
    },
    [roomId],
  );

  // Send typing indicator
  const sendTyping = useCallback(() => {
    if (clientRef.current && clientRef.current.connected && roomId) {
      clientRef.current.publish({
        destination: `/app/chat.typing/${roomId}`,
        body: JSON.stringify({
          userId: currentUserId,
          typing: true,
        }),
      });
    }
  }, [roomId, currentUserId]);

  return {
    messages,
    setMessages,
    isConnected,
    typingUser,
    seenUpdate,
    userStatus,
    sendMessage,
    sendTyping,
    sendStatus,
  };
};

export default useChat;
