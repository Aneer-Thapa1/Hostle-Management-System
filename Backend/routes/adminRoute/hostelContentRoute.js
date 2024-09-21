// routes/hostelContent.js
const express = require("express");
const router = express.Router();
const hostelContentController = require("../../controllers/adminController/hostelContentController.js");
const authMiddleware = require("../../middleware/authMiddleware.js");

// Hostel Info
router.get("/info", authMiddleware, hostelContentController.getHostelInfo);
router.put("/info", authMiddleware, hostelContentController.updateHostelInfo);

// Packages
router.get("/packages", authMiddleware, hostelContentController.getPackages);
router.post("/packages", authMiddleware, hostelContentController.addPackage);
router.put(
  "/packages/:id",
  authMiddleware,
  hostelContentController.updatePackage
);
router.delete(
  "/packages/:id",
  authMiddleware,
  hostelContentController.deletePackage
);

// Facilities
router.get(
  "/facilities",
  authMiddleware,
  hostelContentController.getFacilities
);
router.post("/facilities", authMiddleware, hostelContentController.addFacility);
router.delete(
  "/facilities/:id",
  authMiddleware,
  hostelContentController.deleteFacility
);

// Gallery
router.get(
  "/gallery",
  authMiddleware,
  hostelContentController.getGalleryImages
);
router.post(
  "/gallery",
  authMiddleware,
  hostelContentController.addGalleryImage
);
router.delete(
  "/gallery/:id",
  authMiddleware,
  hostelContentController.deleteGalleryImage
);

// Meals
router.get("/meals", authMiddleware, hostelContentController.getMeals);
router.post("/meals", authMiddleware, hostelContentController.addMeal);
router.put("/meals/:id", authMiddleware, hostelContentController.updateMeal);
router.delete("/meals/:id", authMiddleware, hostelContentController.deleteMeal);

// Attractions
router.get(
  "/attractions",
  authMiddleware,
  hostelContentController.getNearbyAttractions
);
router.post(
  "/attractions",
  authMiddleware,
  hostelContentController.addNearbyAttraction
);
router.put(
  "/attractions/:id",
  authMiddleware,
  hostelContentController.updateNearbyAttraction
);
router.delete(
  "/attractions/:id",
  authMiddleware,
  hostelContentController.deleteNearbyAttraction
);

module.exports = router;
