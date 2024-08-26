const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoute");

const app = express();
app.use(cors());

app.use(bodyParser.json());

// Mount routes
app.use("/api/auth", authRoutes);

// Response of server
const port = 8870;
app.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
});
