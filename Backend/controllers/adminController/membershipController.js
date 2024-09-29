const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getMembership = async (req, res) => {
  try {
    const userId = parseInt(req.user.user.id);

    const membership = await prisma.hostelMembership.findFirst({
      where: {
        hostelId: userId,
        status: "ACTIVE",
      },
      include: {
        hostel: true,
        package: true,
        booking: {
          include: {
            room: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!membership) {
      return res.status(404).json({ message: "No active membership found" });
    }

    res.status(200).json({
      message: "Membership fetched successfully",
      membership: membership,
    });
  } catch (error) {
    console.error("Error fetching membership:", error);
    res
      .status(500)
      .json({ message: "Error fetching membership", error: error.message });
  }
};

const extendMembership = async (req, res) => {
  try {
    if (!req.user || !req.user.user || !req.user.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const { membershipId } = req.body;

    if (!membershipId) {
      return res.status(400).json({ message: "Membership ID is required" });
    }

    const membership = await prisma.hostelMembership.findUnique({
      where: { id: parseInt(membershipId) },
      include: {
        package: true,
        user: true,
        hostel: true,
      },
    });

    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    if (membership.userId !== req.user.user.id) {
      return res.status(403).json({
        message: "Forbidden: You can only extend your own membership",
      });
    }

    if (membership.status !== "ACTIVE") {
      return res
        .status(400)
        .json({ message: "Only active memberships can be extended" });
    }

    const newEndDate = new Date(membership.endDate);
    newEndDate.setDate(newEndDate.getDate() + membership.package.duration);

    const updatedMembership = await prisma.$transaction(async (prisma) => {
      const updated = await prisma.hostelMembership.update({
        where: { id: parseInt(membershipId) },
        data: {
          endDate: newEndDate,
          status: "ACTIVE",
        },
        include: {
          hostel: true,
          package: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          booking: {
            include: {
              room: true,
            },
          },
        },
      });

      // Create a new booking for the extended period
      await prisma.booking.create({
        data: {
          userId: membership.userId,
          hostelId: membership.hostelId,
          packageId: membership.packageId,
          roomId: membership.booking.roomId,
          checkInDate: membership.endDate,
          checkOutDate: newEndDate,
          numberOfOccupants: membership.booking.numberOfOccupants,
          totalPrice: membership.package.price,
          status: "ACCEPTED",
          isActive: true,
        },
      });

      return updated;
    });

    res.status(200).json({
      message: "Membership extended successfully",
      membership: updatedMembership,
    });
  } catch (error) {
    console.error("Error extending membership:", error);
    res
      .status(500)
      .json({ message: "Error extending membership", error: error.message });
  }
};

module.exports = {
  getMembership,
  extendMembership,
};
