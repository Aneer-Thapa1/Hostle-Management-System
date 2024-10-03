const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addPayment = async (req, res) => {
  const { userId, amount, paymentDate, paymentMethod, status } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the active hostel membership for the user
    const activeHostelMembership = await prisma.hostelMembership.findFirst({
      where: {
        userId: parseInt(userId),
        status: "ACTIVE",
      },
      include: {
        hostel: true,
      },
    });

    if (!activeHostelMembership) {
      return res
        .status(404)
        .json({ message: "No active hostel membership found for this user" });
    }

    // Create the payment
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        paymentDate: new Date(paymentDate),
        paymentMethod,
        status,
        user: { connect: { id: parseInt(userId) } },
        hostelMembership: { connect: { id: activeHostelMembership.id } },
      },
      include: {
        user: true,
        hostelMembership: {
          include: {
            hostel: true,
          },
        },
      },
    });

    // If the payment is completed, update the hostel membership status if needed
    if (status === "COMPLETED") {
      // You might want to add additional logic here if needed
      // For example, extending the membership period or updating some other fields
    }

    // Format the response
    const formattedPayment = {
      id: payment.id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      studentName: payment.user.name,
      hostelName: payment.hostelMembership.hostel.hostelName,
    };

    res.status(201).json(formattedPayment);
  } catch (error) {
    console.error("Error adding payment:", error);
    res
      .status(500)
      .json({ message: "Failed to add payment", error: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: true,
        hostelMembership: {
          include: {
            hostel: true,
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
    });

    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      studentName: payment.user.name,
      hostelName: payment.hostelMembership.hostel.hostelName,
    }));

    res.status(200).json(formattedPayments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch payments", error: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        hostelMemberships: {
          include: {
            hostel: true,
          },
        },
      },
    });

    const formattedStudents = students.map((student) => ({
      id: student.id,
      name: student.name,
      hostel: student.hostelMemberships[0]?.hostel.hostelName || "Not assigned",
    }));

    res.status(200).json(formattedStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: error.message });
  }
};

const editPayment = async (req, res) => {
  const { id } = req.params;
  const { amount, paymentDate, paymentMethod, status } = req.body;

  try {
    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        amount: parseFloat(amount),
        paymentDate: new Date(paymentDate),
        paymentMethod,
        status,
      },
      include: {
        user: true,
        hostelMembership: {
          include: {
            hostel: true,
          },
        },
      },
    });

    // Format the response
    const formattedPayment = {
      id: updatedPayment.id,
      amount: updatedPayment.amount,
      paymentDate: updatedPayment.paymentDate,
      paymentMethod: updatedPayment.paymentMethod,
      status: updatedPayment.status,
      studentName: updatedPayment.user.name,
      hostelName: updatedPayment.hostelMembership.hostel.hostelName,
    };

    res.status(200).json(formattedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);
    res
      .status(500)
      .json({ message: "Failed to update payment", error: error.message });
  }
};

const deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.payment.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting payment:", error);
    res
      .status(500)
      .json({ message: "Failed to delete payment", error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        hostelMembership: {
          include: {
            hostel: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const formattedPayment = {
      id: payment.id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      studentName: payment.user.name,
      hostelName: payment.hostelMembership.hostel.hostelName,
    };

    res.status(200).json(formattedPayment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch payment", error: error.message });
  }
};

module.exports = {
  addPayment,
  getPayments,
  getStudents,
  editPayment,
  deletePayment,
  getPaymentById,
};
