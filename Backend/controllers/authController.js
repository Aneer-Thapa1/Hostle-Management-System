const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  const { email, password } = req.body;

  try {
    // Attempt to find the user by email in the 'user' model
    let user = await prisma.user.findUnique({
      where: { userEmail: email },
    });

    let loginType = "user";

    // If not found in 'user', attempt to find in 'hostelOwner'
    if (!user) {
      user = await prisma.hostelOwner.findUnique({
        where: { email: email },
      });
      loginType = "hostelOwner";
    }

    // If neither found, return an error
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(
      password,
      user.userPassword || user.password
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create a JWT payload based on login type
    const payload = {
      user: {
        id: user.id,
        email: user.userEmail || user.email,
        role: loginType,
      },
    };

    // Sign the JWT and set it as a cookie
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the JWT as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    // Return successful login response with role
    res.status(200).json({ message: "Login successful", role: loginType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const registerOwner = async (req, res) => {
  const {
    hostelName,
    hostelLocation,
    ownerName,
    email,
    contact,
    location,
    address,
    password,
    description,
  } = req.body;

  if (
    !hostelName ||
    !hostelLocation ||
    !ownerName ||
    !email ||
    !contact ||
    !location ||
    !address ||
    !password ||
    !description
  ) {
    return res.status(400).send("Please fill all the required fields.");
  }

  try {
    const existingHostel = await prisma.hostelOwner.findUnique({
      where: {
        email: email,
      },
    });

    if (existingHostel) {
      return res
        .status(400)
        .json({ error: "Hostel with that email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newHostelOwner = await prisma.hostelOwner.create({
      data: {
        hostelName: hostelName,
        hostelLocation: hostelLocation,
        ownerName: ownerName,
        email: email,
        contact: contact,
        location: location,
        address: address,
        password: hashedPassword,
        description: description,
      },
    });

    res.status(201).json({
      message: "Hostel owner registered successfully!",
      owner: {
        hostelName: newHostelOwner.hostelName,
        ownerName: newHostelOwner.ownerName,
        email: newHostelOwner.email,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

module.exports = { signup, login, registerOwner };
