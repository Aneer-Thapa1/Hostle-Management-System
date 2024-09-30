const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketManager = require("./socket");

const setupRoutes = require("./routes/routes.js");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketManager.initSocket(server);

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Setup routes
setupRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 404 Route
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

const port = process.env.PORT || 8870;
server.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});

module.exports = { app, server, io };
