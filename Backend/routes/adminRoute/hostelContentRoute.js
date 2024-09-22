const express = require("express");
const router = express.Router();
const hostelContentController = require("../../controllers/adminController/hostelContentController.js");

// Hostel Info
router.get("/info", hostelContentController.getHostelInfo);
router.put("/info", hostelContentController.updateHostelInfo);

// Packages
router.get("/packages", hostelContentController.getPackages);
router.post("/packages", hostelContentController.addPackage);
router.put("/packages/:id", hostelContentController.updatePackage);
router.delete("/packages/:id", hostelContentController.deletePackage);

// Facilities
router.get("/facilities", hostelContentController.getFacilities);
router.post("/facilities", hostelContentController.addFacility);
router.delete("/facilities/:id", hostelContentController.deleteFacility);

// Gallery
router.get("/gallery", hostelContentController.getGalleryImages);
router.post("/gallery", hostelContentController.addGalleryImage);
router.delete("/gallery/:id", hostelContentController.deleteGalleryImage);

// Meals
router.get("/meals", hostelContentController.getMeals);
router.post("/meals", hostelContentController.addMeal);
router.put("/meals/:id", hostelContentController.updateMeal);
router.delete("/meals/:id", hostelContentController.deleteMeal);

// Attractions
router.get("/attractions", hostelContentController.getNearbyAttractions);
router.post("/attractions", hostelContentController.addNearbyAttraction);
router.put("/attractions/:id", hostelContentController.updateNearbyAttraction);
router.delete(
  "/attractions/:id",
  hostelContentController.deleteNearbyAttraction
);

module.exports = router;
