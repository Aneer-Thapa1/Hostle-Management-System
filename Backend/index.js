const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketManager = require("./socket.js");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const setupRoutes = require("./routes/routes.js");
setupRoutes(app);

const io = socketManager.init(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = 8870;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
