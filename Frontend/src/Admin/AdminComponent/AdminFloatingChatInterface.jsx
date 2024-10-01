import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const BASE_URL = "http://localhost:3000/api/chat"; // Update this with your actual base URL
const ADMIN_ID = 1; // Replace with actual admin ID
const ADMIN_TYPE = "HOSTEL_OWNER"; // or "USER" depending on your setup

const AdminFloatingChatInterface = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(BASE_URL);
    setSocket(newSocket);

    newSocket.on("new message", (message) => {
      if (
        selectedConversation &&
        message.conversationId === selectedConversation.id
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      updateConversationLastMessage(message);
    });

    newSocket.on("message read", ({ messageId, userId, userType }) => {
      // Update read status in UI if needed
    });

    fetchConversations();

    return () => newSocket.disconnect();
  }, []);

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
      const response = await axios.get(
        `${BASE_URL}/conversations?userId=${ADMIN_ID}&userType=${ADMIN_TYPE}`
      );
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/conversations/${conversationId}/messages`
      );
      setMessages(response.data);
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
      await axios.post(`${BASE_URL}/messages`, {
        conversationId: selectedConversation.id,
        senderId: ADMIN_ID,
        senderType: ADMIN_TYPE,
        content: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateConversationLastMessage = (message) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === message.conversationId
          ? { ...conv, lastMessage: message.content }
          : conv
      )
    );
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await axios.post(`${BASE_URL}/messages/read`, {
        messageId,
        userId: ADMIN_ID,
        userType: ADMIN_TYPE,
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg transition-all duration-300 ${
        isExpanded ? "h-[32rem]" : "h-16"
      }`}
    >
      <div
        className="bg-blue-600 text-white p-4 rounded-t-lg cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-bold">Admin Chat</h2>
      </div>

      {isExpanded && (
        <div className="h-[calc(100%-4rem)] flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 overflow-y-auto p-4">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-2 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedConversation(conv)}
                >
                  <h3 className="font-semibold">
                    {conv.participants[0].user?.name ||
                      conv.participants[0].hostelOwner?.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.messages[0]?.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="p-2 border-b">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-blue-600"
                >
                  &larr; Back
                </button>
                <h3 className="font-semibold">
                  {selectedConversation.participants[0].user?.name ||
                    selectedConversation.participants[0].hostelOwner?.name}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 ${
                      message.senderType === ADMIN_TYPE
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        message.senderType === ADMIN_TYPE
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-2 border-t">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFloatingChatInterface;
