const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const signup = async (req, res) => {
  const { userName, userEmail, userContact, userAddress, userPassword } =
    req.body;

  // Validate required fields
  if (
    !userName ||
    !userEmail ||
    !userContact ||
    !userAddress ||
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
      where: { email: userEmail },
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
        name: userName,
        email: userEmail,
        contact: userContact,
        address: userAddress,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(409).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    // Attempt to find the user by email in the 'user' model
    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    let role = "STUDENT";

    // If not found in 'user', attempt to find in 'hostelOwner'
    if (!user) {
      user = await prisma.hostelOwner.findUnique({
        where: { email: email },
      });
      role = "HOSTEL_OWNER";
    }

    // If neither found, return an error
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create a JWT payload
    const payload = {
      user: {
        id: user.id,
        email: role === "STUDENT" ? user.userEmail : user.email,
        role: role === "STUDENT" ? "STUDENT" : "HOSTEL_OWNER",
      },
    };

    // Sign the JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    // Set the JWT as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 86400000 * 10, // 1 hour
    });

    // Return successful login response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token, // Include token in response body
      user: {
        id: user.id,
        name: role === "STUDENT" ? user.userName : user.ownerName,
        email: role === "STUDENT" ? user.userEmail : user.email,
        role: role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred during login" });
  }
};

const registerOwner = async (req, res) => {
  const {
    hostelName,
    ownerName,
    email,
    contact,
    location,
    address,
    password,
    description,
    latitude,
    longitude,
    mainPhoto,
  } = req.body;

  console.log(
    hostelName,
    ownerName,
    email,
    contact,
    location,
    address,
    password,
    description,
    latitude,
    longitude
  );
  if (
    !hostelName ||
    !ownerName ||
    !email ||
    !contact ||
    !location ||
    !address ||
    !password ||
    !description ||
    !latitude ||
    !longitude
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
        hostelName,
        ownerName,
        email,
        contact,
        location,
        mainPhoto,
        address,
        password: hashedPassword,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });

    res.status(201).json({
      message: "Hostel owner registered successfully!",
      owner: {
        hostelName: newHostelOwner.hostelName,
        ownerName: newHostelOwner.ownerName,
        email: newHostelOwner.email,
        latitude: newHostelOwner.latitude,
        longitude: newHostelOwner.longitude,
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
