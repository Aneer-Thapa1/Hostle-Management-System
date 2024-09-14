const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all deals with pagination and filtering
const getDeals = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    roomType,
  } = req.query;
  const hostelOwnerId = req.user.id; // Assuming you have authentication middleware

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = { hostelOwnerId };
    if (roomType && roomType !== "allRooms") {
      where.roomType = roomType;
    }

    const [deals, totalCount] = await prisma.$transaction([
      prisma.deal.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.deal.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.status(200).json({
      message: "Deals retrieved successfully",
      data: deals,
      meta: {
        currentPage: parseInt(page),
        itemsPerPage: take,
        totalItems: totalCount,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error("Get deals error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new deal
const addDeal = async (req, res) => {
  const { name, roomType, discount, startDate, endDate, description } =
    req.body;
  const hostelOwnerId = req.user.id; // Assuming you have authentication middleware

  try {
    const newDeal = await prisma.deal.create({
      data: {
        name,
        roomType,
        discount: parseFloat(discount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        hostelOwner: { connect: { id: hostelOwnerId } },
      },
    });

    res.status(201).json({
      message: "Deal added successfully",
      deal: newDeal,
    });
  } catch (error) {
    console.error("Add deal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an existing deal
const updateDeal = async (req, res) => {
  const { id } = req.params;
  const { name, roomType, discount, startDate, endDate, description } =
    req.body;
  const hostelOwnerId = req.user.id; // Assuming you have authentication middleware

  try {
    const updatedDeal = await prisma.deal.update({
      where: {
        id: parseInt(id),
        hostelOwnerId, // Ensure the deal belongs to the authenticated hostel owner
      },
      data: {
        name,
        roomType,
        discount: parseFloat(discount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
      },
    });

    res.status(200).json({
      message: "Deal updated successfully",
      deal: updatedDeal,
    });
  } catch (error) {
    console.error("Update deal error:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Deal not found or unauthorized" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Delete a deal
const deleteDeal = async (req, res) => {
  const { id } = req.params;
  const hostelOwnerId = req.user.id; // Assuming you have authentication middleware

  try {
    await prisma.deal.delete({
      where: {
        id: parseInt(id),
        hostelOwnerId, // Ensure the deal belongs to the authenticated hostel owner
      },
    });

    res.status(200).json({
      message: "Deal deleted successfully",
    });
  } catch (error) {
    console.error("Delete deal error:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Deal not found or unauthorized" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = {
  getDeals,
  addDeal,
  updateDeal,
  deleteDeal,
};
