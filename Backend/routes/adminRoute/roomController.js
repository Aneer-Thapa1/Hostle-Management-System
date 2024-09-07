// routes/user.js
const express = require("express");
const router = express.Router();
const roomController = require("../../controllers/adminController/roomController.js");

router.post("/signup", roomController.addRoom);
router.post("/login", roomController.getRoom);
