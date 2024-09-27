const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBooking = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const userId = req.user.user.id;
    const { hostelId, packageId, checkInDate, numberOfPersons, totalPrice } =
      req.body;

    console.log(
      userId,
      hostelId,
      packageId,
      checkInDate,
      numberOfPersons,
      totalPrice
    );

    // Validate input
    if (
      !hostelId ||
      !packageId ||
      !checkInDate ||
      !numberOfPersons ||
      totalPrice === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse check-in date
    const parsedCheckInDate = new Date(checkInDate);

    // Validate check-in date
    if (parsedCheckInDate < new Date()) {
      return res
        .status(400)
        .json({ message: "Check-in date must be in the future" });
    }

    // Fetch hostel details
    const hostel = await prisma.hostelOwner.findUnique({
      where: { id: parseInt(hostelId) },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // Fetch package details
    const package = await prisma.package.findUnique({
      where: { id: parseInt(packageId) },
    });

    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Calculate checkout date based on package duration
    const checkOutDate = new Date(parsedCheckInDate);
    checkOutDate.setDate(checkOutDate.getDate() + package.duration);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: parseInt(userId),
        hostelId: parseInt(hostelId),
        packageId: parseInt(packageId),
        checkInDate: parsedCheckInDate,
        checkOutDate: checkOutDate,
        numberOfStudents: parseInt(numberOfPersons),
        totalPrice: parseFloat(totalPrice),
        status: "pending",
      },
    });

    res.status(201).json({
      message: "Booking request created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const userId = req.user.user.id;

    // Parse query parameters for filtering
    const { status, startDate, endDate } = req.query;

    // Build the where clause for filtering
    let whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.checkInDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Fetch bookings
    const bookings = await prisma.booking.findMany({
      where: {
        ...whereClause,
        userId: parseInt(userId),
      },
      include: {
        hostel: true,
        package: true,
      },
      orderBy: {
        checkInDate: "desc",
      },
    });

    res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res
      .status(500)
      .json({ message: "Error retrieving bookings", error: error.message });
  }
};

const acceptBooking = async (req, res) => {
  const { bookingId, roomId } = req.body;

  console.log(bookingId, roomId);

  if (!bookingId || !roomId) {
    return res
      .status(400)
      .json({ error: "Booking ID and Room ID are required" });
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Find the booking
      const booking = await prisma.booking.findUnique({
        where: { id: parseInt(bookingId) },
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.status !== "pending") {
        throw new Error("Booking is not in a pending state");
      }

      // Find the room
      const room = await prisma.room.findUnique({
        where: { id: parseInt(roomId) },
      });

      console.log(room);

      if (!room) {
        throw new Error("Room not found");
      }

      if (room.status !== "available") {
        throw new Error("Selected room is not available");
      }

      // Update the booking
      const updatedBooking = await prisma.booking.update({
        where: { id: parseInt(bookingId) },
        data: {
          status: "confirmed",
          roomId: parseInt(roomId),
        },
      });

      // Update the room status to occupied
      await prisma.room.update({
        where: { id: parseInt(roomId) },
        data: { status: "occupied" },
      });

      return updatedBooking;
    });

    res.status(200).json({
      message: "Booking accepted successfully",
      booking: result,
    });
  } catch (error) {
    console.error("Accept booking error:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createBooking, getBookings, acceptBooking };
