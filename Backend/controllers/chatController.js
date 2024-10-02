const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createConversation: async (req, res) => {
    const { hostelId } = req.body;
    const userId = req.user.user.id;
    const userRole = req.user.user.role;

    console.log(
      "Creating conversation. User:",
      userId,
      "Role:",
      userRole,
      "HostelId:",
      hostelId
    );

    if (userRole === "HOSTEL_OWNER") {
      return res
        .status(403)
        .json({ error: "Hostel owners cannot initiate conversations" });
    }

    if (!hostelId) {
      return res.status(400).json({ error: "Missing hostelId" });
    }

    try {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: userId } } },
            { participants: { some: { hostelOwnerId: parseInt(hostelId) } } },
          ],
        },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
              hostelOwner: {
                select: {
                  id: true,
                  hostelName: true,
                  ownerName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (existingConversation) {
        console.log("Existing conversation found:", existingConversation.id);
        return res.status(200).json(existingConversation);
      }

      const newConversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: userId }, { hostelOwnerId: parseInt(hostelId) }],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
              hostelOwner: {
                select: {
                  id: true,
                  hostelName: true,
                  ownerName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      console.log("New conversation created:", newConversation.id);
      res.status(201).json(newConversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({
        error: "Failed to create conversation",
        details: error.message,
      });
    }
  },

  getConversations: async (req, res) => {
    const userId = req.user.user.id;
    const userRole = req.user.user.role;
    console.log("Fetching conversations for User:", userId, "Role:", userRole);

    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some:
              userRole === "STUDENT"
                ? { userId: userId }
                : { hostelOwnerId: userId },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
              hostelOwner: {
                select: {
                  id: true,
                  hostelName: true,
                  ownerName: true,
                  email: true,
                },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: {
          lastMessageAt: "desc",
        },
      });

      const formattedConversations = conversations.map((conv) => {
        const otherParticipant = conv.participants.find(
          (p) => (userRole === "STUDENT" ? p.hostelOwnerId : p.userId) !== null
        );
        return {
          id: conv.id,
          otherParticipant:
            userRole === "STUDENT"
              ? otherParticipant.hostelOwner
              : otherParticipant.user,
          lastMessage: conv.messages[0] || null,
          lastMessageAt: conv.lastMessageAt,
        };
      });

      console.log(`Found ${formattedConversations.length} conversations`);
      res.json(formattedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({
        error: "Failed to fetch conversations",
        details: error.message,
      });
    }
  },

  getMessages: async (req, res) => {
    const { conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.user.id;
    const userRole = req.user.user.role;

    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }

    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some:
              userRole === "STUDENT"
                ? { userId: userId }
                : { hostelOwnerId: userId },
          },
        },
      });

      if (!conversation) {
        return res
          .status(403)
          .json({ error: "Access denied to this conversation" });
      }

      const messages = await prisma.message.findMany({
        where: { conversationId: conversationId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          readBy: true,
        },
      });

      console.log(`Found ${messages.length} messages`);
      res.json(messages.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch messages", details: error.message });
    }
  },

  sendMessage: async (req, res) => {
    const { conversationId, content } = req.body;
    const senderId = req.user.user.id;
    const senderRole = req.user.user.role;

    if (!conversationId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const participantInConversation = conversation.participants.some((p) =>
        senderRole === "STUDENT"
          ? p.userId === senderId
          : p.hostelOwnerId === senderId
      );

      if (!participantInConversation) {
        return res
          .status(403)
          .json({ error: "User is not a participant in this conversation" });
      }

      const senderType = senderRole === "STUDENT" ? "USER" : "HOSTEL_OWNER";

      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId,
          senderType,
          content,
        },
        include: {
          readBy: true,
        },
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      });

      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res
        .status(500)
        .json({ error: "Failed to send message", details: error.message });
    }
  },

  markMessageAsRead: async (req, res) => {
    const { messageId } = req.body;
    const userId = req.user.user.id;
    const userRole = req.user.user.role;

    if (!messageId) {
      return res.status(400).json({ error: "Missing messageId" });
    }

    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { conversation: { include: { participants: true } } },
      });

      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      const participantInConversation = message.conversation.participants.some(
        (p) =>
          userRole === "STUDENT"
            ? p.userId === userId
            : p.hostelOwnerId === userId
      );

      if (!participantInConversation) {
        return res
          .status(403)
          .json({ error: "User is not a participant in this conversation" });
      }

      const messageRead = await prisma.messageRead.create({
        data: {
          messageId,
          [userRole === "STUDENT" ? "userId" : "hostelOwnerId"]: userId,
        },
      });

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
