// routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController.js");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/registerOwner", userController.registerOwner);
// router.get("/profile", userController.getProfile);
// router.put("/profile", userController.updateProfile);

module.exports = router;
