const authRoutes = require("./authRoute");
const chatRoutes = require("./chatRoute");
const roomRoutes = require("./adminRoute/roomRoute");
const authMiddleware = require("../middleware/authMiddleware");
const hostelRoutes = require("./userRoute/hostelRoute");
const favoriteRoute = require("./userRoute/favoriteRoute");
const bookingRoutes = require("./userRoute/bookingRoute");
const hostelContent = require("./adminRoute/hostelContentRoute");
const membershipRoute = require("./adminRoute/membershipRoute");
const paymentRoute = require("./adminRoute/paymentRoute");
const dashboardRoute = require("./adminRoute/dashboardRoute");

const setupRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", authMiddleware, roomRoutes);
  app.use("/api/hostel", authMiddleware, hostelRoutes);
  app.use("/api/favorite", authMiddleware, favoriteRoute);
  app.use("/api/booking", authMiddleware, bookingRoutes);
  app.use("/api/content", authMiddleware, hostelContent);
  app.use("/api/membership", authMiddleware, membershipRoute);
  app.use("/api/chat", authMiddleware, chatRoutes);
  app.use("/api/payment", authMiddleware, paymentRoute);
  app.use("/api/admin", authMiddleware, dashboardRoute);
};

module.exports = setupRoutes;
