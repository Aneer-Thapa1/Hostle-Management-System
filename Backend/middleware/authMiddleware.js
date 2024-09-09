const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Get token from the header
  const authHeader = req.header("Authorization");

  console.log("Auth Header:", authHeader);

  // Check if auth header is not provided
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No authorization header, authentication denied" });
  }

  // Check if the auth header starts with "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Invalid token format, must start with 'Bearer'" });
  }

  // Extract the token (remove "Bearer " from the beginning)
  const token = authHeader.slice(7);

  console.log("Extracted Token:", token);

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key

    console.log("Decoded Token:", decoded);

    // Attach the decoded user to the request object
    req.user = decoded.user;

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    // If token verification fails
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
