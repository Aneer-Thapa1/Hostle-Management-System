const authRoutes = require("./authRoute");
const roomRoutes = require("./adminRoute/roomRoute");
const authMiddleware = require("../middleware/authMiddleware");
const dealRoutes = require("./adminRoute/dealRoutes");
const hostelRoutes = require("./userRoute/hostelRoute");
const favoriteRoute = require("./userRoute/favoriteRoute");
const bookingRoutes = require("./userRoute/bookingRoute");

const setupRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", authMiddleware, roomRoutes);
  app.use("/api/deals", authMiddleware, dealRoutes);
  app.use("/api/hostel", authMiddleware, hostelRoutes);
  app.use("/api/favorite", authMiddleware, favoriteRoute);
  app.use("/api/booking", authMiddleware, bookingRoutes);
};

module.exports = setupRoutes;
