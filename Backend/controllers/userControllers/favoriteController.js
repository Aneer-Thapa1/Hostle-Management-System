const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getFavorites = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    console.log("userid", req.user.user.id);
    const userId = req.user.user.id;

    // Check if userId is defined
    if (userId === undefined) {
      return res
        .status(400)
        .json({ message: "Bad Request: User ID is missing" });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: userId },
      include: {
        hostel: true,
      },
    });

    const formattedFavorites = favorites.map((favorite) => ({
      id: favorite.hostel.id,
      name: favorite.hostel.hostelName,
      location: favorite.hostel.location,
      // Add other fields as needed
    }));

    res.json({
      favorites: formattedFavorites,
      totalCount: formattedFavorites.length,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res
      .status(500)
      .json({ message: "Error fetching favorites", error: error.message });
  }
};

const setFavorite = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const { hostelId } = req.body;

    const userId = req.user.user.id;

    // Check if userId and hostelId are defined
    if (userId === undefined || hostelId === undefined) {
      return res
        .status(400)
        .json({ message: "Bad Request: User ID or Hostel ID is missing" });
    }

    // Check if the favorite already exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_hostelId: {
          userId: userId,
          hostelId: parseInt(hostelId),
        },
      },
    });

    if (existingFavorite) {
      // If it exists, remove it (toggle off)
      await prisma.favorite.delete({
        where: {
          userId_hostelId: {
            userId: userId,
            hostelId: parseInt(hostelId),
          },
        },
      });
      res.json({
        message: "Favorite removed successfully",
        isFavorite: false,
      });
    } else {
      // If it doesn't exist, create it (toggle on)
      await prisma.favorite.create({
        data: {
          userId: userId,
          hostelId: parseInt(hostelId),
        },
      });
      res.json({ message: "Favorite added successfully", isFavorite: true });
    }
  } catch (error) {
    console.error("Error setting favorite:", error);
    res
      .status(500)
      .json({ message: "Error setting favorite", error: error.message });
  }
};

module.exports = { getFavorites, setFavorite };
