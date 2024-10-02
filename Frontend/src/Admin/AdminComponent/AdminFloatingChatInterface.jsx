import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  FaSearch,
  FaRegPaperPlane,
  FaUserCircle,
  FaComments,
  FaTimes,
} from "react-icons/fa";
import { useSocket } from "../../features/SocketContext"; // Import useSocket hook
import { selectUser } from "../../features/userSlice";
import ErrorBoundary from "../../app/ErrorBoundary";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AdminFloatingChatInterface = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messageEndRef = useRef(null);

  const socket = useSocket();
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", handleNewMessage);

      return () => {
        socket.off("getMessage");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (isExpanded) {
      fetchConversations();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const totalUnread = conversations.reduce(
      (sum, conv) => sum + (conv.unread || 0),
      0
    );
    setUnreadCount(totalUnread);
  }, [conversations]);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get("/api/chat/conversations");
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axiosInstance.get(
        `/api/chat/conversations/${conversationId}/messages`
      );
      setMessages(response.data);
      console.log(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axiosInstance.post("/api/chat/messages", {
        conversationId: selectedConversation.id,
        content: newMessage,
      });
      const sentMessage = response.data;
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage("");
      updateConversationLastMessage(sentMessage);

      if (socket && isConnected) {
        socket.emit("sendMessage", {
          receiverId: selectedConversation.otherParticipant.id,
          data: sentMessage,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNewMessage = (data) => {
    console.log("New message received:", data);
    if (
      selectedConversation &&
      data.conversationId === selectedConversation.id
    ) {
      setMessages((prevMessages) => [...prevMessages, data]);
    }
    updateConversationLastMessage(data);
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === data.conversationId
          ? { ...conv, unread: (conv.unread || 0) + 1 }
          : conv
      )
    );
  };

  const updateConversationLastMessage = (message) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === message.conversationId
          ? {
              ...conv,
              lastMessage: message.content,
              lastMessageAt: message.createdAt,
            }
          : conv
      )
    );
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      await axiosInstance.post(`/api/chat/messages/read`, { conversationId });
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === conversationId ? { ...conv, unread: 0 } : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed bottom-2 right-2 z-50">
      {!isExpanded ? (
        <button
          onClick={toggleExpand}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <FaComments size={40} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-[28rem] flex flex-col">
          <div className="bg-blue-600 text-white p-2 rounded-t-lg flex justify-between items-center">
            <h2 className="text-sm font-bold">Hostel Owner Chat</h2>
            <button
              onClick={toggleExpand}
              className="text-white focus:outline-none"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {!selectedConversation ? (
            <div className="flex-1 overflow-y-auto p-2">
              <div className="mb-2">
                <div className="relative">
                  <FaSearch
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={12}
                  />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-7 pr-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-2 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedConversation(conv);
                    markMessagesAsRead(conv.id);
                  }}
                >
                  <div className="flex items-center">
                    <FaUserCircle className="text-gray-400 text-lg mr-2" />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-sm">
                        {conv.otherParticipant.name}
                      </h3>
                      <div className="text-xs text-gray-600 truncate">
                        {conv.lastMessage || "No messages yet"}
                      </div>
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-1 py-0.5 mt-1">
                      {conv.unread} new
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="p-2 border-b flex items-center">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-blue-600 text-sm mr-2"
                >
                  &larr;
                </button>
                <h3 className="font-semibold text-sm">
                  {selectedConversation.otherParticipant.name}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 flex ${
                      message.senderType === "HOSTEL_OWNER"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg text-sm ${
                        message.senderType === "HOSTEL_OWNER"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-2 border-t flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow text-sm bg-gray-100 border border-gray-300 rounded-l-md p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-2 py-1 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 flex items-center justify-center"
                >
                  <FaRegPaperPlane size={12} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFloatingChatInterface;
