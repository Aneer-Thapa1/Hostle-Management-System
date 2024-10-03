const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/adminController/dashboardController");

router.get("/dashboard", dashboardController.getEnhancedHostelDashboardData);

module.exports = router;
