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

  try {
    const hostelOwnerId = req.user.user.id;

    const existingHostelOwner = await prisma.hostelOwner.findUnique({
      where: { id: hostelOwnerId },
    });

    if (!existingHostelOwner) {
      return res.status(404).json({ error: "Hostel owner not found" });
    }

    const newRoom = await prisma.room.create({
      data: {
        roomIdentifier,
        type,
        floor: parseInt(floor, 10),
        amenities: JSON.stringify(amenities),
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
    type,
    minPrice,
    maxPrice,
    capacity,
  } = req.query;

  try {
    if (roomId) {
      const room = await prisma.room.findUnique({
        where: { id: parseInt(roomId) },
        include: {
          hostelOwner: true,
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
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const filter = {};
      if (status && status !== "allRooms") filter.status = status;
      if (type) filter.type = type;
      if (minPrice) filter.price = { gte: parseFloat(minPrice) };
      if (maxPrice)
        filter.price = { ...filter.price, lte: parseFloat(maxPrice) };
      if (capacity) filter.capacity = { gte: parseInt(capacity) };

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
  const roomId = req.params.id;

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
    const hostelOwnerId = req.user.id;

    const existingRoom = await prisma.room.findFirst({
      where: {
        id: parseInt(roomId),
        hostelOwnerId: hostelOwnerId,
      },
    });

    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found or unauthorized" });
    }

    const updateData = {
      ...(roomIdentifier && { roomIdentifier }),
      ...(type && { type }),
      ...(floor && { floor: parseInt(floor, 10) }),
      ...(amenities && { amenities: JSON.stringify(amenities) }),
      ...(status && { status }),
      ...(capacity && { capacity: parseInt(capacity, 10) }),
      ...(description && { description }),
      ...(price && { price: parseFloat(price) }),
      ...(dateAvailable && { dateAvailable: new Date(dateAvailable) }),
      ...(roomCondition && { roomCondition }),
    };

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
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    }
  }
};

const deleteRoom = async (req, res) => {
  const roomId = req.params.id;

  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required" });
  }

  try {
    const hostelOwnerId = req.user.id;

    // First, find the room and its associated hostel owner
    const existingRoom = await prisma.room.findFirst({
      where: {
        id: parseInt(roomId),
        hostelOwnerId: hostelOwnerId,
      },
      include: {
        hostelOwner: {
          include: {
            bookings: {
              where: {
                status: { in: ["pending", "confirmed"] },
              },
            },
          },
        },
      },
    });

    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found or unauthorized" });
    }

    // Check if there are any active bookings for the hostel
    if (existingRoom.hostelOwner.bookings.length > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete room while hostel has active bookings" });
    }

    // If no active bookings, proceed with deletion
    await prisma.room.delete({
      where: { id: parseInt(roomId) },
    });

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const getRoomAvailability = async (req, res) => {
  const { roomId } = req.params;
  const { startDate, endDate } = req.query;

  if (!roomId || !startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Room ID, start date, and end date are required" });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
      include: {
        bookings: {
          where: {
            status: { in: ["pending", "confirmed"] },
            OR: [
              {
                checkInDate: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
              {
                checkOutDate: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
              {
                AND: [
                  { checkInDate: { lte: new Date(startDate) } },
                  { checkOutDate: { gte: new Date(endDate) } },
                ],
              },
            ],
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const isAvailable = room.bookings.length === 0;

    res.status(200).json({
      message: "Room availability retrieved successfully",
      isAvailable,
      conflictingBookings: room.bookings,
    });
  } catch (error) {
    console.error("Get room availability error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const getRoomDetails = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        hostelOwner: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "All rooms retrieved successfully",
      data: rooms,
    });
  } catch (error) {
    console.error("Get all rooms error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

module.exports = {
  addRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  getRoomAvailability,
  getRoomDetails,
};
