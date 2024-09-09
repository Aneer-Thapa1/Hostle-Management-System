const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const setupRoutes = require("./routes/routes.js");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

setupRoutes(app);

// Response of server
const port = 8870;
app.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
});
