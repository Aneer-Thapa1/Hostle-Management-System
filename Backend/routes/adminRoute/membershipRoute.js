const express = require("express");
const router = express.Router();
const membership = require("../../controllers/adminController/membershipController");

router.get("/getMembership", membership.getMembership);
router.post("/extendMembership", membership.extendMembership);

module.exports = router;
