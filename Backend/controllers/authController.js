const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prismaClientConfig");

const signup = async (req, res) => {
  const { userAddress, userContact, userEmail, userName, userPassword } =
    req.body;

  // Validate required fields
  if (
    !userAddress ||
    !userContact ||
    !userEmail ||
    !userName ||
    !userPassword
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { userEmail },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        userAddress,
        userContact,
        userEmail,
        userName,
        userPassword: hashedPassword,
      },
    });

    // Remove password from the response
    const { userPassword: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === "P2002" && error.meta?.target?.includes("userEmail")) {
      return res.status(409).json({ error: "Email already in use" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  try {
    // Find the user by email using Prisma
    const user = await prisma.user.findUnique({
      where: { userEmail: userEmail },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(userPassword, user.userPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create a JWT payload
    const payload = {
      user: {
        id: user.id,
        email: user.userEmail,
      },
    };

    // Sign the JWT and set it as a cookie
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the JWT as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { signup, login };
