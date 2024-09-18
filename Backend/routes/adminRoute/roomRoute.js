// routes/user.js
const express = require("express");
const router = express.Router();
const roomController = require("../../controllers/adminController/roomController.js");
const authMiddleware = require("../../middleware/authMiddleware.js");

router.post("/addRoom", authMiddleware, roomController.addRoom);
router.get("/getRooms", authMiddleware, roomController.getRooms);
router.put("/updateRoom/:id", authMiddleware, roomController.updateRoom);

module.exports = router;