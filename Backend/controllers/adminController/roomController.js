const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addRoom = async (req, res) => {
  console.log("Received room data:", req.body);

  const {
    roomIdentifier,
    type,
    floor,
    amenities,
    status,
    capacity,
    description,
    price,
  } = req.body;

  // Validate required fields
  if (!roomIdentifier || !type || !floor || !capacity || !description) {
    return res.status(400).json({
      error:
        "Room identifier, type, floor, capacity, description, and price are required",
    });
  }

  try {
    // Get the hostelOwnerId from the authenticated user
    const hostelOwnerId = req.user.id;

    // Ensure the HostelOwner exists
    const existingHostelOwner = await prisma.hostelOwner.findUnique({
      where: { id: hostelOwnerId },
    });

    if (!existingHostelOwner) {
      return res.status(404).json({ error: "Hostel owner not found" });
    }

    // Create the new room
    const newRoom = await prisma.room.create({
      data: {
        roomIdentifier,
        type,
        floor,
        amenities: JSON.stringify(amenities), // Store amenities as a JSON string
        status: status || "Available",
        capacity: parseInt(capacity, 10),
        description,
        price: parseFloat(price),
        hostelOwner: { connect: { id: hostelOwnerId } },
      },
    });

    console.log("New room created:", newRoom);

    res.status(201).json({
      message: "Room added successfully",
      room: newRoom,
    });
  } catch (error) {
    console.error("Add room error:", error);
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("roomIdentifier")
    ) {
      res
        .status(400)
        .json({ error: "A room with this identifier already exists" });
    } else {
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
};

const getRoom = async (req, res) => {
  const { roomId } = req.params;

  // Validate the required parameter
  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required" });
  }

  try {
    // Fetch the room details along with related photos and hostel owner details
    const room = await prisma.rooms.findUnique({
      where: { id: parseInt(roomId) },
      include: {
        photos: true,
        hostelOwner: true,
      },
    });

    // If room not found, return an error
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({
      message: "Room retrieved successfully",
      room,
    });
  } catch (error) {
    console.error("Get room error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addRoom,
  getRoom,
};
