const express = require("express");
const router = express.Router();

const bookingController = require("../../controllers/userControllers/bookingController");

router.post("/addBooking", bookingController.createBooking);

module.exports = router;
