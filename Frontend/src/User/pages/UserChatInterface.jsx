import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  FaSearch,
  FaRegPaperPlane,
  FaUserCircle,
  FaSpinner,
} from "react-icons/fa";
import { useSocket } from "../../features/SocketContext";

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

const UserChatInterface = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const messageEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const socket = useSocket();
  const currentUser = useSelector((state) => state.user);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/chat/conversations");
      setConversations(response.data);
      console.log("Fetched conversations:", response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Failed to load conversations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", handleNewMessage);

      return () => {
        socket.off("getMessage");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axiosInstance.get(
        `/api/chat/conversations/${conversationId}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
    }
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
      updateConversationLastMessage(sentMessage);
      setNewMessage("");

      if (socket) {
        socket.emit("sendMessage", {
          receiverId: selectedConversation.otherParticipant.id,
          data: sentMessage,
        });
        console.log("Message emitted through socket:", sentMessage);
      } else {
        console.warn("Socket not connected. Message not emitted.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleNewMessage = useCallback((data) => {
    console.log("New message received:", data);
    setMessages((prevMessages) => [...prevMessages, data]);
    updateConversationLastMessage(data);
  }, []);

  const updateConversationLastMessage = (message) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === message.conversationId
          ? {
              ...conv,
              lastMessage: message.content,
              lastMessageAt: message.createdAt,
              unread:
                conv.id !== selectedConversation?.id
                  ? (conv.unread || 0) + 1
                  : 0,
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

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!conv || !conv.otherParticipant || !conv.otherParticipant.hostelName) {
      console.log("Invalid conversation object:", conv);
      return false;
    }
    return conv.otherParticipant.hostelName
      .toLowerCase()
      .includes(searchTerm.toLowerCase() || "");
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <FaSpinner className="animate-spin mr-2" />
        <span>Loading conversations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 h-screen flex flex-col text-white">
      <Navbar />
      {!socket && (
        <div className="bg-red-500 text-white p-2 text-center">
          Socket disconnected. Trying to reconnect...
        </div>
      )}
      <div className="flex-grow flex flex-col overflow-hidden p-4">
        <h1 className="text-3xl font-bold mb-4">Messages</h1>
        <div className="flex-grow flex bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          {/* Conversation List */}
          <div className="w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor text-white text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
                      selectedConversation?.id === conv.id ? "bg-gray-700" : ""
                    }`}
                    onClick={() => {
                      setSelectedConversation(conv);
                      markMessagesAsRead(conv.id);
                    }}
                  >
                    <div className="flex items-center">
                      <FaUserCircle className="text-gray-400 text-2xl mr-3" />
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-sm">
                            {conv.otherParticipant.hostelName}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {conv.lastMessageAt &&
                              new Date(conv.lastMessageAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {conv.lastMessage &&
                          typeof conv.lastMessage === "object"
                            ? conv.lastMessage.content
                            : conv.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                    {conv.unread > 0 && (
                      <span className="inline-block bg-primaryColor text-white text-xs rounded-full px-2 py-1 mt-2">
                        {conv.unread} new
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 mt-4">
                  No conversations found
                </p>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="w-3/4 flex flex-col bg-gray-900">
            {selectedConversation ? (
              <>
                <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center">
                  <FaUserCircle className="text-gray-400 text-3xl mr-3" />
                  <h2 className="text-xl font-bold">
                    {selectedConversation.otherParticipant.hostelName}
                  </h2>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.senderId ===
                        selectedConversation.otherParticipant.id
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderId ===
                          selectedConversation.otherParticipant.id
                            ? "bg-gray-700 text-white rounded-bl-none"
                            : "bg-primaryColor text-white rounded-br-none"
                        }`}
                      >
                        {message.content}
                        <div className="text-xs text-gray-300 mt-1 text-right">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
                <form
                  onSubmit={sendMessage}
                  className="bg-gray-800 p-4 border-t border-gray-700"
                >
                  <div className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-grow bg-gray-700 border border-gray-600 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-primaryColor text-white"
                      placeholder="Type a message..."
                    />
                    <button
                      type="submit"
                      className="bg-primaryColor text-white px-4 py-2 rounded-r-lg hover:bg-primaryColor-dark transition duration-300 flex items-center justify-center"
                    >
                      <FaRegPaperPlane className="mr-2" />
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-900">
                <p className="text-xl text-gray-400">
                  Select a conversation to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChatInterface;
