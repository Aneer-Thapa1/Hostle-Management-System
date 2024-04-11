const express = require("express");

const app = express();

const cors = require("cors");

// Response of server
const port = 8870;
app.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
});
