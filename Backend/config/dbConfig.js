const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hostle_management",
});

db.connect((error) => {
  if (error) {
    console.log("Error connecting to database:", error);
  } else {
    console.log("Database connected successfully!!");
  }
});

module.exports = db;
