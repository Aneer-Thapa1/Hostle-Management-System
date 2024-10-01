// routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController.js");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/registerOwner", userController.registerOwner);

module.exports = router;
