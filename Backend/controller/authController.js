const db = require("../config/dbConfig");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const { userAddress, userContact, userEmail, userName, userPassword } =
    req.body;

  if (
    !userAddress ||
    !userContact ||
    !userEmail ||
    !userName ||
    !userPassword
  ) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { userEmail },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

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

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
