const socketIo = require("socket.io");

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Adjust as needed
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    const userType = socket.handshake.auth.userType;
    if (!userId || !userType) {
      return next(new Error("Invalid credentials"));
    }
    socket.userId = userId;
    socket.userType = userType;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`A ${socket.userType} connected with ID: ${socket.userId}`);

    // Join room based on user type and ID
    const roomName = `${socket.userType}_${socket.userId}`;
    socket.join(roomName);
    console.log(`${socket.userType} ${socket.userId} joined room: ${roomName}`);

    socket.on("disconnect", () => {
      console.log(`${socket.userType} ${socket.userId} disconnected`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
