const express = require("express");
const router = express.Router();

const favoriteController = require("../../controllers/userControllers/favoriteController");

// Route to add a hostel to favorites
router.post("/favorites", favoriteController.setFavorite);

// Route to remove a hostel from favorites
// router.delete("/favorites", favoriteController.removeFavorite);

// Route to get all favorite hostels for the logged-in user
router.get("/favorites", favoriteController.getFavorites);

module.exports = router;
