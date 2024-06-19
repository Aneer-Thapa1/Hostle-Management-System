const db = require("../config/dbConfig");

const signup = (req, res) => {
  const [hostleName, hostleEmail, password] = req.body;

  const getEmail = "SELECT hostleEmail FROM users;";

  db.query(getEmail, (error, message) => {
    if (error) {
      console.log(error);
    }

    if (message.length > 0) {
    }
  });
};
