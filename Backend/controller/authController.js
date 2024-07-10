const db = require("../config/dbConfig");
const bcrypt = require("bcrypt");

const signup = (req, res) => {
  const [hostleName, hostleEmail, password] = req.body;

  const getEmail = "SELECT hostleEmail FROM users;";

  if (!hostleName || !hostleEmail || !password) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  db.query(getEmail, (error, message) => {
    if (error) {
      console.log(error);
    }

    if (message.length > 0) {
      return res;
    }
  });
};
