// routes/user.js
const express = require("express");
const router = express.Router();
const roomController = require("../../controllers/adminController/roomController.js");

router.post("/addRoom", roomController.addRoom);
router.get("/getRooms", roomController.getRoom);

module.exports = router;
