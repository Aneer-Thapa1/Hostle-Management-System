const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const setupRoutes = require("./routes/routes.js");
setupRoutes(app);

const port = 8870;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
