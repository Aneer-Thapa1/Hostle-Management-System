const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/conversations", chatController.createConversation);
router.get("/conversations", chatController.getConversations);
router.get(
  "/conversations/:conversationId/messages",
  chatController.getMessages
);
router.post("/messages", chatController.sendMessage);
router.post("/messages/read", chatController.markMessageAsRead);

module.exports = router;
