const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBooking = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const { hostelId, packageId, checkInDate, numberOfPersons, totalPrice } =
      req.body;

    if (
      !hostelId ||
      !packageId ||
      !checkInDate ||
      !numberOfPersons ||
      totalPrice === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedCheckInDate = new Date(checkInDate);

    const packageDetails = await prisma.package.findUnique({
      where: { id: parseInt(packageId) },
    });

    if (!packageDetails) {
      return res.status(404).json({ message: "Package not found" });
    }

    const checkOutDate = new Date(parsedCheckInDate);
    checkOutDate.setDate(checkOutDate.getDate() + packageDetails.duration);

    const booking = await prisma.booking.create({
      data: {
        user: { connect: { id: parseInt(userId) } },
        hostel: { connect: { id: parseInt(hostelId) } },
        package: { connect: { id: parseInt(packageId) } },
        checkInDate: parsedCheckInDate,
        checkOutDate: checkOutDate,
        numberOfOccupants: parseInt(numberOfPersons),
        totalPrice: parseFloat(totalPrice),
        status: "PENDING",
        isActive: true,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        hostel: { select: { id: true, hostelName: true } },
        package: { select: { id: true, name: true } },
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
    const { status, startDate, endDate, hostelId } = req.query;

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

    if (hostelId) {
      whereClause.hostelId = parseInt(hostelId);
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: true,
        hostel: true,
        package: true,
      },
      orderBy: {
        createdAt: "desc",
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

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const booking = await prisma.booking.findUnique({
        where: { id: parseInt(bookingId) },
        include: { package: true, user: true, hostel: true },
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      const room = await prisma.room.findUnique({
        where: { id: parseInt(roomId) },
      });

      if (!room) {
        throw new Error("Room not found");
      }

      const newOccupancy = room.currentOccupancy + booking.numberOfOccupants;
      const newAvailableSpots = room.totalCapacity - newOccupancy;

      if (newAvailableSpots < 0) {
        throw new Error("Not enough space in the selected room");
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "ACCEPTED",
          room: { connect: { id: room.id } },
        },
        include: {
          user: true,
          hostel: true,
          package: true,
          room: true,
        },
      });

      await prisma.room.update({
        where: { id: room.id },
        data: {
          currentOccupancy: newOccupancy,
          availableSpots: newAvailableSpots,
        },
      });

      const membership = await prisma.hostelMembership.create({
        data: {
          userId: booking.userId,
          hostelId: booking.hostelId,
          packageId: booking.packageId,
          bookingId: booking.id,
          startDate: booking.checkInDate,
          endDate: booking.checkOutDate,
          status: "ACTIVE",
        },
      });

      return { updatedBooking, membership };
    });

    res.status(200).json({
      message:
        "Booking accepted, room assigned, and membership created successfully",
      booking: result.updatedBooking,
      membership: result.membership,
    });
  } catch (error) {
    console.error("Error accepting booking:", error);
    res.status(500).json({
      message: "Error accepting booking",
      error: error.message,
    });
  }
};

const declineBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(bookingId) },
      data: {
        status: "REJECTED",
      },
      include: {
        user: true,
        hostel: true,
        package: true,
      },
    });

    res.status(200).json({
      message: "Booking declined successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error declining booking:", error);
    res
      .status(500)
      .json({ message: "Error declining booking", error: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const userId = req.user.user.id;
    const { status, startDate, endDate } = req.query;

    let whereClause = { userId: parseInt(userId) };

    if (status) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.checkInDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        hostel: true,
        package: true,
        room: true,
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

module.exports = {
  createBooking,
  getBookings,
  acceptBooking,
  declineBooking,
  getUserBookings,
};
