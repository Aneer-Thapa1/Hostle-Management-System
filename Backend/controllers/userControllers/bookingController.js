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

module.exports = { createBooking };
