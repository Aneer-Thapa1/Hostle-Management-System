// routes/user.js
const express = require("express");
const router = express.Router();
const roomController = require("../../controllers/adminController/roomController.js");

router.post("/addRoom", roomController.addRoom);
router.get("/getRooms", roomController.getRooms);

module.exports = router;
