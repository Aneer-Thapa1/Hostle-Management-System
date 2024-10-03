const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/adminController/paymentController");

router.post("/payments", paymentController.addPayment);
router.get("/payments", paymentController.getPayments);
router.get("/students", paymentController.getStudents);
router.put("/payments/:id", paymentController.editPayment);
router.delete("/payments/:id", paymentController.deletePayment);
router.get("/payments/:id", paymentController.getPaymentById);

module.exports = router;
