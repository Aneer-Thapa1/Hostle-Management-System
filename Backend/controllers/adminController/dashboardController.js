const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getEnhancedHostelDashboardData = async (req, res) => {
  try {
    const hostelOwnerId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      occupancyData,
      bookingStats,
      revenueData,
      packagePerformance,
      ratings,
      roomStatus,
      paymentStats,
      membershipInsights,
      occupancyTrend,
      revenueTrend,
      bookingTrend,
      roomTypeOccupancy,
      packageRevenue,
    ] = await Promise.all([
      // Occupancy Data
      prisma.room.groupBy({
        by: ["type"],
        where: { hostelOwnerId },
        _sum: {
          currentOccupancy: true,
          totalCapacity: true,
        },
      }),

      // Booking Statistics
      prisma.booking.groupBy({
        by: ["status"],
        where: { hostelId: hostelOwnerId },
        _count: { id: true },
      }),

      // Revenue Data
      prisma.payment.aggregate({
        where: {
          hostelMembership: { hostel: { id: hostelOwnerId } },
          paymentDate: { gte: oneMonthAgo },
          status: "COMPLETED",
        },
        _sum: { amount: true },
      }),

      // Package Performance
      prisma.booking.groupBy({
        by: ["packageId"],
        where: {
          hostelId: hostelOwnerId,
          status: "ACCEPTED",
        },
        _count: { id: true },
        orderBy: {
          _count: { id: "desc" },
        },
        take: 5,
      }),

      // Ratings
      prisma.rating.aggregate({
        where: { hostelId: hostelOwnerId },
        _avg: { rating: true },
        _count: { id: true },
      }),

      // Room Status
      prisma.room.groupBy({
        by: ["status"],
        where: { hostelOwnerId },
        _count: { id: true },
      }),

      // Payment Stats
      prisma.payment.groupBy({
        by: ["status"],
        where: { hostelMembership: { hostel: { id: hostelOwnerId } } },
        _sum: { amount: true },
      }),

      // Membership Insights
      prisma.hostelMembership.groupBy({
        by: ["status"],
        where: { hostelId: hostelOwnerId },
        _count: { id: true },
      }),

      // Occupancy Trend (last 30 days)
      prisma.$queryRaw`
        SELECT DATE(checkInDate) as date, COUNT(*) as count
        FROM Booking
        WHERE hostelId = ${hostelOwnerId}
          AND checkInDate >= ${oneMonthAgo}
          AND status = 'ACCEPTED'
        GROUP BY DATE(checkInDate)
        ORDER BY DATE(checkInDate)
      `,

      // Revenue Trend (last 30 days)
      prisma.$queryRaw`
        SELECT DATE(paymentDate) as date, SUM(amount) as total
        FROM Payment
        JOIN HostelMembership ON Payment.hostelMembershipId = HostelMembership.id
        WHERE HostelMembership.hostelId = ${hostelOwnerId}
          AND paymentDate >= ${oneMonthAgo}
          AND Payment.status = 'COMPLETED'
        GROUP BY DATE(paymentDate)
        ORDER BY DATE(paymentDate)
      `,

      // Booking Trend (last 30 days)
      prisma.$queryRaw`
        SELECT DATE(createdAt) as date, COUNT(*) as count
        FROM Booking
        WHERE hostelId = ${hostelOwnerId}
          AND createdAt >= ${oneMonthAgo}
        GROUP BY DATE(createdAt)
        ORDER BY DATE(createdAt)
      `,

      // Room Type Occupancy
      prisma.room.groupBy({
        by: ["type"],
        where: { hostelOwnerId },
        _sum: {
          currentOccupancy: true,
          totalCapacity: true,
        },
      }),

      // Package Revenue
      prisma.booking.groupBy({
        by: ["packageId"],
        where: {
          hostelId: hostelOwnerId,
          status: "ACCEPTED",
          checkInDate: { gte: oneMonthAgo },
        },
        _sum: { totalPrice: true },
      }),
    ]);

    // Fetch package details for names
    const packageIds = packagePerformance.map((p) => p.packageId);
    const packageDetails = await prisma.package.findMany({
      where: { id: { in: packageIds } },
      select: { id: true, name: true },
    });

    const dashboardData = {
      overview: {
        totalOccupancy: occupancyData.reduce(
          (sum, room) => sum + (room._sum.currentOccupancy || 0),
          0
        ),
        totalCapacity: occupancyData.reduce(
          (sum, room) => sum + (room._sum.totalCapacity || 0),
          0
        ),
        totalBookings: bookingStats.reduce(
          (sum, status) => sum + status._count.id,
          0
        ),
        totalRevenue: revenueData._sum.amount || 0,
        averageRating: ratings._avg.rating || 0,
      },
      occupancy: {
        byRoomType: occupancyData.map((room) => ({
          type: room.type,
          occupied: room._sum.currentOccupancy || 0,
          total: room._sum.totalCapacity || 0,
        })),
        trend: occupancyTrend,
      },
      bookings: {
        byStatus: bookingStats.map((status) => ({
          status: status.status,
          count: status._count.id,
        })),
        trend: bookingTrend,
      },
      revenue: {
        total: revenueData._sum.amount || 0,
        trend: revenueTrend,
        byPackage: packageRevenue.map((pkg) => {
          const details = packageDetails.find((p) => p.id === pkg.packageId);
          return {
            packageName: details ? details.name : "Unknown Package",
            revenue: pkg._sum.totalPrice || 0,
          };
        }),
      },
      topPackages: packagePerformance.map((pkg) => {
        const details = packageDetails.find((p) => p.id === pkg.packageId);
        return {
          packageName: details ? details.name : "Unknown Package",
          bookings: pkg._count.id,
        };
      }),
      ratings: {
        average: ratings._avg.rating || 0,
        count: ratings._count.id,
      },
      roomStatus: roomStatus.map((status) => ({
        status: status.status,
        count: status._count.id,
      })),
      payments: paymentStats.map((status) => ({
        status: status.status,
        amount: status._sum.amount || 0,
      })),
      memberships: membershipInsights.map((status) => ({
        status: status.status,
        count: status._count.id,
      })),
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching enhanced hostel dashboard data:", error);
    res.status(500).json({
      message: "Error fetching hostel dashboard data",
      error: error.message,
    });
  }
};

module.exports = {
  getEnhancedHostelDashboardData,
};
