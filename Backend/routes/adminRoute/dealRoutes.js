const express = require("express");
const router = express.Router();
const dealController = require("../../controllers/adminController/dealController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/getDeals", authMiddleware, dealController.getDeals);
router.post("/addDeal", authMiddleware, dealController.addDeal);
router.put("/updateDeal/:id", authMiddleware, dealController.updateDeal);
router.delete("/deleteDeal/:id", authMiddleware, dealController.deleteDeal);

module.exports = router;
