import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaSearch, FaRegPaperPlane, FaUserCircle } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";
const socket = io(apiUrl);

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const UserChatInterface = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messageEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchConversations();
    const queryParams = new URLSearchParams(location.search);
    const hostelId = queryParams.get("hostelId");
    if (hostelId) {
      createOrSelectConversation(hostelId);
    }

    socket.on("new message", handleNewMessage);
    socket.on("message read", handleMessageRead);

    return () => {
      socket.off("new message", handleNewMessage);
      socket.off("message read", handleMessageRead);
    };
  }, [location]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      socket.emit("join conversation", selectedConversation.id);
    }
    return () => {
      if (selectedConversation) {
        socket.emit("leave conversation", selectedConversation.id);
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get("/api/chat/conversations");
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const createOrSelectConversation = async (hostelId) => {
    try {
      const response = await axiosInstance.post("/api/chat/conversations", {
        hostelId,
      });
      const newConversation = response.data;
      setConversations((prevConversations) => {
        const exists = prevConversations.some(
          (conv) => conv.id === newConversation.id
        );
        if (!exists) {
          return [...prevConversations, newConversation];
        }
        return prevConversations;
      });
      setSelectedConversation(newConversation);
    } catch (error) {
      console.error("Error creating/selecting conversation:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axiosInstance.get(
        `/api/chat/conversations/${conversationId}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
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
      setNewMessage("");
      updateConversationLastMessage(sentMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNewMessage = (message) => {
    if (
      selectedConversation &&
      message.conversationId === selectedConversation.id
    ) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
    updateConversationLastMessage(message);
  };

  const handleMessageRead = ({ messageId, conversationId }) => {
    if (selectedConversation && conversationId === selectedConversation.id) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    }
  };

  const updateConversationLastMessage = (message) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === message.conversationId
          ? {
              ...conv,
              lastMessage: message.content,
              timestamp: message.createdAt,
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

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 h-screen flex flex-col text-white">
      <Navbar />
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
              {filteredConversations.map((conv) => (
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
                        <h3 className="font-semibold text-sm">{conv.name}</h3>
                        <span className="text-xs text-gray-400">
                          {new Date(conv.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <span className="inline-block bg-primaryColor text-white text-xs rounded-full px-2 py-1 mt-2">
                      {conv.unread} new
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="w-3/4 flex flex-col bg-gray-900">
            {selectedConversation ? (
              <>
                <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center">
                  <FaUserCircle className="text-gray-400 text-3xl mr-3" />
                  <h2 className="text-xl font-bold">
                    {selectedConversation.name}
                  </h2>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.senderId === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderId === "user"
                            ? "bg-primaryColor text-white rounded-br-none"
                            : "bg-gray-700 text-white rounded-bl-none"
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
