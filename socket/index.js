const express = require("express"); // Use CommonJS require syntax
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
  },
});

let onlineUser = []; // Array to hold online users

// Function to add a user to the onlineUser array
const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (userExists) {
    // If user already exists, update their socket ID
    userExists.socketId = socketId;
  } else {
    // Add new user to the onlineUser array
    onlineUser.push({ userId, socketId });
  }
};

// Function to remove a user based on their socket ID
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

// Function to get a user by their userId
const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id); // Log connected socket ID

  // Event when a new user connects
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id); // Add user to online users
  });

  // Event for sending a message
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId); // Get the receiver
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data); // Emit message to receiver
    } else {
      console.log("User offline");
    }
  });

  // Event when a user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id); // Log disconnected socket ID
    removeUser(socket.id); // Remove user from online users
  });
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
