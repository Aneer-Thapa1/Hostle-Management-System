const express = require("express");
const router = express.Router();
const dealController = require("../../controllers/adminController/dealController");

router.get("/getDeals", dealController.getDeals);
router.post("/addDeal", dealController.addDeal);
router.put("/updateDeal/:id", dealController.updateDeal);
router.delete("/deleteDeal/:id", dealController.deleteDeal);

module.exports = router;
