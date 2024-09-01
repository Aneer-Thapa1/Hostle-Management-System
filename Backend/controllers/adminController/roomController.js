const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addRoom = async (req, res) => {
  const {
    roomNumber,
    type,
    price,
    capacity,
    description,
    amenities,
    floor,
    roomCondition,
    dateAvailable,
    hostelOwnerId,
    photos,
  } = req.body;

  // Validate required fields
  if (!roomNumber || !type || !price || !capacity || !hostelOwnerId) {
    return res.status(400).json({
      error:
        "Room number, type, price, capacity, and hostel owner ID are required",
    });
  }

  try {
    // Ensure the HostelOwner exists
    const existingHostelOwner = await prisma.hostelOwner.findUnique({
      where: { id: hostelOwnerId },
    });

    if (!existingHostelOwner) {
      return res.status(404).json({ error: "Hostel owner not found" });
    }

    // Create the new room
    const newRoom = await prisma.rooms.create({
      data: {
        roomNumber,
        type,
        price,
        capacity,
        description,
        amenities,
        floor,
        roomCondition,
        dateAvailable,
        hostelOwnerId,
        photos: {
          create: photos.map((url) => ({ url })),
        },
      },
    });

    // Create an entry in the bridge table for the relationship
    await prisma.hostelRoom.create({
      data: {
        hostelOwnerId,
        roomId: newRoom.id,
      },
    });

    res.status(201).json({
      message: "Room added successfully",
      room: newRoom,
    });
  } catch (error) {
    console.error("Add room error:", error);
    res.status(500).json({ error: "Internal server error" });
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
