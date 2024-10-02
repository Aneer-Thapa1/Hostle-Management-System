const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("newUser", (userId) => {
    console.log("New user:", userId);
    // Handle new user logic
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    console.log("Message sent to:", receiverId, "Data:", data);
    // Broadcast the message to the receiver
    socket.to(receiverId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
