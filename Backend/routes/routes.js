const authRoutes = require("./authRoute");
const roomRoutes = require("./adminRoute/roomController");
const authMiddleware = require("../middleware/authMiddleware");

const setupRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/room", authMiddleware, roomRoutes);
};

module.exports = setupRoutes;
