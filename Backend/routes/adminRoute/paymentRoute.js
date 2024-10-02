const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/adminController/paymentController");

router.post("/payments", paymentController.addPayment);
router.get("/payments", paymentController.getPayments);
router.get("/students", paymentController.getStudents);

module.exports = router;
