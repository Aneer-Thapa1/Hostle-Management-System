const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const socketIo = require("socket.io");

let io;

module.exports = {
  initializeSocketIO: (server) => {
    io = socketIo(server);
    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("join conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined conversation: ${conversationId}`);
      });

      socket.on("leave conversation", (conversationId) => {
        socket.leave(conversationId);
        console.log(`User left conversation: ${conversationId}`);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
  },

  createConversation: async (req, res) => {
    console.log("Creating conversation. Request body:", req.body);
    const { participantIds, participantType } = req.body;
    if (
      !participantIds ||
      !Array.isArray(participantIds) ||
      participantIds.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing participantIds" });
    }

    if (
      !participantType ||
      (participantType !== "USER" && participantType !== "HOSTEL_OWNER")
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing participantType" });
    }

    try {
      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: participantIds.map((id) => ({
              [participantType === "USER" ? "userId" : "hostelOwnerId"]:
                parseInt(id),
            })),
          },
        },
        include: {
          participants: true,
        },
      });

      console.log("Conversation created successfully:", conversation);
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({
        error: "Failed to create conversation",
        details: error.message,
      });
    }
  },

  getConversations: async (req, res) => {
    console.log("Fetching conversations. Query:", req.query);
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({ error: "Missing userId or userType" });
    }

    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              [userType === "USER" ? "userId" : "hostelOwnerId"]:
                parseInt(userId),
            },
          },
        },
        include: {
          participants: true,
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          lastMessageAt: "desc",
        },
      });

      console.log(
        `Found ${conversations.length} conversations for user ${userId}`
      );
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({
        error: "Failed to fetch conversations",
        details: error.message,
      });
    }
  },

  getMessages: async (req, res) => {
    console.log("Fetching messages. Params:", req.params, "Query:", req.query);
    const { conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }

    try {
      const messages = await prisma.message.findMany({
        where: {
          conversationId: conversationId,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          readBy: true,
        },
      });

      console.log(
        `Found ${messages.length} messages for conversation ${conversationId}`
      );
      res.json(messages.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch messages", details: error.message });
    }
  },

  sendMessage: async (req, res) => {
    console.log("Sending message. Request body:", req.body);
    const { conversationId, senderId, senderType, content } = req.body;

    if (!conversationId || !senderId || !senderType || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId: parseInt(senderId),
          senderType,
          content,
        },
        include: {
          conversation: {
            include: {
              participants: true,
            },
          },
        },
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      });

      io.to(conversationId).emit("new message", message);
      console.log("Message sent and emitted:", message);

      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res
        .status(500)
        .json({ error: "Failed to send message", details: error.message });
    }
  },

  markMessageAsRead: async (req, res) => {
    console.log("Marking message as read. Request body:", req.body);
    const { messageId, userId, userType } = req.body;

    if (!messageId || !userId || !userType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const messageRead = await prisma.messageRead.create({
        data: {
          messageId,
          [userType === "USER" ? "userId" : "hostelOwnerId"]: parseInt(userId),
        },
      });

      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { conversation: true },
      });

      io.to(message.conversationId).emit("message read", {
        messageId,
        userId,
        userType,
      });

      console.log("Message marked as read:", messageRead);
      res.status(201).json(messageRead);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({
        error: "Failed to mark message as read",
        details: error.message,
      });
    }
  },
};
