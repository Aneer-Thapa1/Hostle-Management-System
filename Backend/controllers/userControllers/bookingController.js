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
    const { hostelId, checkInDate, checkOutDate, dealId } = req.body;

    // Validate input
    if (!hostelId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse dates
    const parsedCheckInDate = new Date(checkInDate);
    const parsedCheckOutDate = new Date(checkOutDate);

    // Validate dates
    if (parsedCheckInDate >= parsedCheckOutDate) {
      return res
        .status(400)
        .json({ message: "Check-out date must be after check-in date" });
    }

    // Calculate number of nights
    const nights = Math.ceil(
      (parsedCheckOutDate - parsedCheckInDate) / (1000 * 60 * 60 * 24)
    );

    // Fetch hostel and room details
    const hostel = await prisma.hostelOwner.findUnique({
      where: { id: parseInt(hostelId) },
      include: { rooms: true },
    });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // Find available room
    const availableRoom = hostel.rooms.find(
      (room) => room.status === "available"
    );

    if (!availableRoom) {
      return res
        .status(400)
        .json({ message: "No available rooms for the selected dates" });
    }

    // Calculate total price
    let totalPrice = availableRoom.price * nights;

    // Apply deal discount if applicable
    if (dealId) {
      const deal = await prisma.deal.findUnique({ where: { id: dealId } });
      if (
        deal &&
        deal.startDate <= parsedCheckInDate &&
        deal.endDate >= parsedCheckOutDate
      ) {
        totalPrice *= 1 - deal.discount / 100;
      }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        hostelId,
        dealId,
        checkInDate: parsedCheckInDate,
        checkOutDate: parsedCheckOutDate,
        totalPrice,
        status: "pending",
      },
    });

    // Update room status
    await prisma.room.update({
      where: { id: parseInt(availableRoom.id) },
      data: { status: "occupied" },
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

module.exports = { createBooking };
