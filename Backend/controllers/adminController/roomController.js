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
    dateAvailable,
    roomCondition,
  } = req.body;

  // Validate required fields
  if (
    !roomIdentifier ||
    !type ||
    !floor ||
    !capacity ||
    !description ||
    !price
  ) {
    return res.status(400).json({
      error:
        "Room identifier, type, floor, capacity, description, and price are required",
    });
  }

  console.log(floor);

  try {
    // Get the hostelOwnerId from the authenticated user
    const hostelOwnerId = req.user.user.id;

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
        floor: parseInt(floor, 10),
        amenities: JSON.stringify(amenities), // Store amenities as a JSON string
        status: status || "available",
        capacity: parseInt(capacity, 10),
        description,
        price: parseFloat(price),
        dateAvailable: dateAvailable ? new Date(dateAvailable) : new Date(),
        roomCondition: roomCondition || "good",
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

const getRooms = async (req, res) => {
  const { roomId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    status,
  } = req.query;

  console.log("Received query parameters:", {
    page,
    limit,
    sortBy,
    sortOrder,
    status,
  });

  try {
    if (roomId) {
      // Fetch a single room if roomId is provided
      const room = await prisma.room.findUnique({
        where: { id: parseInt(roomId) },
        include: {
          hostelOwner: true,
          bookings: true,
        },
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      return res.status(200).json({
        message: "Room retrieved successfully",
        room,
      });
    } else {
      // Fetch multiple rooms with pagination and filtering
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      // Create a filter object
      const filter = {};
      if (status && status !== "allRoom") {
        filter.status = status;
      }

      console.log("Applied filter:", filter);

      const [rooms, totalCount] = await prisma.$transaction([
        prisma.room.findMany({
          where: filter,
          skip,
          take,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            hostelOwner: true,
          },
        }),
        prisma.room.count({ where: filter }),
      ]);

      console.log(`Found ${rooms.length} rooms out of ${totalCount} total`);

      const totalPages = Math.ceil(totalCount / take);

      res.status(200).json({
        message: "Rooms retrieved successfully",
        data: rooms,
        meta: {
          currentPage: parseInt(page),
          itemsPerPage: take,
          totalItems: totalCount,
          totalPages: totalPages,
          appliedFilter: filter,
        },
      });
    }
  } catch (error) {
    console.error("Get rooms error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const updateRoom = async (req, res) => {
  const { roomId } = req.params;
  const {
    roomIdentifier,
    type,
    floor,
    amenities,
    status,
    capacity,
    description,
    price,
    dateAvailable,
    roomCondition,
  } = req.body;

  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required" });
  }

  try {
    // Get the hostelOwnerId from the authenticated user
    const hostelOwnerId = req.user.id;

    // Check if the room exists and belongs to the authenticated hostel owner
    const existingRoom = await prisma.room.findFirst({
      where: {
        id: parseInt(roomId),
        hostelOwnerId: hostelOwnerId,
      },
    });

    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found or unauthorized" });
    }

    // Prepare the update data
    const updateData = {};
    if (roomIdentifier) updateData.roomIdentifier = roomIdentifier;
    if (type) updateData.type = type;
    if (floor) updateData.floor = parseInt(floor, 10);
    if (amenities) updateData.amenities = JSON.stringify(amenities);
    if (status) updateData.status = status;
    if (capacity) updateData.capacity = parseInt(capacity, 10);
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (dateAvailable) updateData.dateAvailable = new Date(dateAvailable);
    if (roomCondition) updateData.roomCondition = roomCondition;

    // Update the room
    const updatedRoom = await prisma.room.update({
      where: { id: parseInt(roomId) },
      data: updateData,
    });

    console.log("Room updated:", updatedRoom);

    res.status(200).json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Update room error:", error);
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("roomIdentifier")
    ) {
      res.status(400).json({ error: "Room identifier already in use" });
    } else {
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  }
};

const deleteRoom = async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required" });
  }

  try {
    // Get the hostelOwnerId from the authenticated user
    const hostelOwnerId = req.user.id;

    // Check if the room exists and belongs to the authenticated hostel owner
    const existingRoom = await prisma.room.findFirst({
      where: {
        id: parseInt(roomId),
        hostelOwnerId: hostelOwnerId,
      },
    });

    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found or unauthorized" });
    }

    // Delete the room
    await prisma.room.delete({
      where: { id: parseInt(roomId) },
    });

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = {
  addRoom,
  getRooms,
  updateRoom,
  deleteRoom,
};
