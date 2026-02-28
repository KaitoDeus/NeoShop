import api from "./api";

const chatService = {
  // User: get or create chat room
  getMyRoom: async () => {
    const res = await api.get("/chat/room");
    return res.data;
  },

  // Admin: get all rooms
  getAllRooms: async () => {
    const res = await api.get("/chat/rooms");
    return res.data;
  },

  // Get messages for a room (paginated)
  getMessages: async (roomId, page = 0, size = 50) => {
    const res = await api.get(`/chat/rooms/${roomId}/messages`, {
      params: { page, size },
    });
    return res.data;
  },

  // Mark messages as read
  markAsRead: (roomId) => api.post(`/chat/rooms/${roomId}/read`),

  markAllAsRead: () => api.post("/chat/rooms/read-all"),
  deleteRoom: (roomId) => api.delete(`/chat/rooms/${roomId}`),

  // Get unread count
  getUnreadCount: async () => {
    const res = await api.get("/chat/unread");
    return res.data;
  },
};

export default chatService;
