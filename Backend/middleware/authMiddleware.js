const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  // Check if the header starts with 'Bearer '
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  // Extract the token (everything after 'Bearer ')
  const token = authHeader.substring(7);

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request
    req.user = decoded;

    // Proceed to the next middleware
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = auth;
