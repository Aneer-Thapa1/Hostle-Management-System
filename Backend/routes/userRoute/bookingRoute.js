const express = require("express");
const router = express.Router();

const bookingController = require("../../controllers/userControllers/bookingController");

router.post("/addBooking", bookingController.createBooking);
router.get("/getBookings", bookingController.getBookings);
router.post("/acceptBooking", bookingController.acceptBooking);

module.exports = router;
