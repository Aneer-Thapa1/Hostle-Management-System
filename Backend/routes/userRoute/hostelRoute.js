const express = require("express");
const router = express.Router();

const hostelController = require("../../controllers/userControllers/hostelController");

// Get a single hostel (Protected)
router.get("/hostel/:id", hostelController.getHostel);

// Get all hostels (Protected)
router.get("/hostels", hostelController.getHostels);

router.get("/nearby", hostelController.getNearbyHostels);

router.get("/all-hostels", hostelController.allHostels);

module.exports = router;
