const authRoutes = require("./authRoute");
const roomRoutes = require("./adminRoute/roomController");
const authMiddleware = require("../middleware/authMiddleware");
const dealRoutes = require("./adminRoute/dealRoutes");

const setupRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/rooms", authMiddleware, roomRoutes);
  app.use("/api/deals", dealRoutes);
};

module.exports = setupRoutes;
