const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getHostel = async (req, res) => {
  try {
    const hostelId = parseInt(req.params.id);

    const hostelData = await prisma.hostelOwner.findUnique({
      where: { id: hostelId },
      include: {
        Room: {
          select: {
            id: true,
            roomIdentifier: true,
            type: true,
            floor: true,
            amenities: true,
            status: true,
            capacity: true,
            description: true,
            price: true,
            roomCondition: true,
            dateAvailable: true,
          },
        },
        Deal: {
          select: {
            id: true,
            name: true,
            roomType: true,
            discount: true,
            startDate: true,
            endDate: true,
            description: true,
          },
        },
      },
    });

    if (!hostelData) {
      return res.status(404).json({
        status: "error",
        message: "Hostel not found",
        data: null,
      });
    }

    // Parse amenities JSON string for each room
    hostelData.Room = hostelData.Room.map((room) => ({
      ...room,
      amenities: room.amenities ? JSON.parse(room.amenities) : [],
    }));

    // Calculate minimum price from deals
    const minDealPrice =
      hostelData.Deal.length > 0
        ? Math.min(...hostelData.Deal.map((deal) => deal.discount))
        : null;

    // Count number of rooms
    const roomCount = hostelData.Room.length;

    // Count total capacity
    const totalCapacity = hostelData.Room.reduce(
      (sum, room) => sum + room.capacity,
      0
    );

    // Prepare the response object
    const response = {
      id: hostelData.id,
      hostelName: hostelData.hostelName,
      ownerName: hostelData.ownerName,
      email: hostelData.email,
      contact: hostelData.contact,
      location: hostelData.location,
      address: hostelData.address,
      latitude: hostelData.latitude,
      longitude: hostelData.longitude,
      description: hostelData.description,
      mainPhoto: hostelData.mainPhoto,
      rooms: hostelData.Room,
      deals: hostelData.Deal,
      minDealPrice: minDealPrice,
      roomCount: roomCount,
      totalCapacity: totalCapacity,
    };

    res.status(200).json({
      status: "success",
      message: "Hostel data retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching hostel details:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: null,
    });
  }
};

const getHostels = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      location = "",
      maxPrice,
    } = req.query;
    const userId = req.user ? req.user.id : null; // Assuming you have user information in the request

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const searchLower = search.toLowerCase();
    const locationLower = location.toLowerCase();

    const whereClause = {
      OR: [
        { hostelName: { contains: searchLower } },
        { location: { contains: searchLower } },
        { description: { contains: searchLower } },
      ],
    };

    if (location) {
      whereClause.location = { contains: locationLower };
    }

    if (maxPrice) {
      whereClause.Room = {
        some: {
          price: { lte: parseFloat(maxPrice) },
        },
      };
    }

    // Fetch hostels and user's favorites
    const [hostels, totalCount, userFavorites] = await Promise.all([
      prisma.hostelOwner.findMany({
        where: whereClause,
        include: {
          Room: {
            select: {
              price: true,
              amenities: true,
            },
          },
        },
        skip: skip,
        take: pageSize,
      }),
      prisma.hostelOwner.count({ where: whereClause }),
      userId
        ? prisma.favorite.findMany({
            where: { userId: userId },
            select: { hostelId: true },
          })
        : [],
    ]);

    const favoriteHostelIds = new Set(userFavorites.map((fav) => fav.hostelId));

    // Format hostel data and calculate minimum price
    const formattedHostels = hostels.map((hostel) => ({
      id: hostel.id,
      name: hostel.hostelName,
      location: hostel.location,
      description: hostel.description,
      price: Math.min(...hostel.Room.map((room) => room.price)),
      rating: hostel.rating || 0,
      image: hostel.mainPhoto || "default_image_url",
      amenities: [...new Set(hostel.Room.flatMap((room) => room.amenities))],
      isFavorite: favoriteHostelIds.has(hostel.id),
    }));

    // Sort the formatted hostels by price
    formattedHostels.sort((a, b) => a.price - b.price);

    res.json({
      hostels: formattedHostels,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res
      .status(500)
      .json({ message: "Error fetching hostels", error: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user information in the request

    const favorites = await prisma.favorite.findMany({
      where: { userId: userId },
      include: {
        hostel: {
          include: {
            Room: {
              select: {
                price: true,
                amenities: true,
              },
            },
          },
        },
      },
    });

    const formattedFavorites = favorites.map((favorite) => ({
      id: favorite.hostel.id,
      name: favorite.hostel.hostelName,
      location: favorite.hostel.location,
      description: favorite.hostel.description,
      price: Math.min(...favorite.hostel.Room.map((room) => room.price)),
      rating: favorite.hostel.rating || 0,
      image: favorite.hostel.mainPhoto || "default_image_url",
      amenities: [
        ...new Set(favorite.hostel.Room.flatMap((room) => room.amenities)),
      ],
      isFavorite: true,
    }));

    res.json({
      favorites: formattedFavorites,
      totalCount: formattedFavorites.length,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res
      .status(500)
      .json({ message: "Error fetching favorites", error: error.message });
  }
};

const getNearbyHostels = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5, limit = 10 } = req.query;

    // Input validation
    if (!latitude || !longitude) {
      return res.status(400).json({
        status: "error",
        message: "Latitude and longitude are required query parameters",
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);
    const lim = parseInt(limit);

    if (
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return res.status(400).json({
        status: "error",
        message: `Invalid latitude or longitude. Received: lat=${latitude}, lon=${longitude}`,
      });
    }

    if (isNaN(rad) || rad <= 0) {
      return res.status(400).json({
        status: "error",
        message: `Invalid radius. Received: ${radius}`,
      });
    }

    if (isNaN(lim) || lim <= 0) {
      return res.status(400).json({
        status: "error",
        message: `Invalid limit. Received: ${limit}`,
      });
    }

    // Fetch nearby hostels using MariaDB compatible query
    const nearbyHostels = await prisma.$queryRaw`
      SELECT 
        id, 
        hostelName, 
        location, 
        latitude, 
        longitude, 
        mainPhoto,
      
        ST_Distance_Sphere(
          point(longitude, latitude),
          point(${lon}, ${lat})
        ) / 1000 AS distance
      FROM HostelOwner
      HAVING distance <= ${rad}
      ORDER BY distance
      LIMIT ${lim} 
      WHERE
    `;

    if (nearbyHostels.length === 0) {
      return res.json({
        status: "success",
        data: [],
        count: 0,
      });
    }

    // Fetch minimum prices for the nearby hostels
    const hostelIds = nearbyHostels.map((hostel) => hostel.id);
    const minPrices = await prisma.room.groupBy({
      by: ["hostelOwnerId"],
      _min: {
        price: true,
      },
      where: {
        hostelOwnerId: {
          in: hostelIds,
        },
      },
    });

    const minPriceMap = minPrices.reduce((acc, item) => {
      acc[item.hostelOwnerId] = item._min.price;
      return acc;
    }, {});

    // Format the results
    const formattedHostels = nearbyHostels.map((hostel) => ({
      id: hostel.id,
      hostelName: hostel.hostelName,
      location: hostel.location,
      latitude: hostel.latitude,
      longitude: hostel.longitude,
      mainPhoto: hostel.mainPhoto,
      // rating: hostel.rating,
      distance: Math.round(hostel.distance * 10) / 10, // Round to 1 decimal place
      minPrice: minPriceMap[hostel.id] || null,
    }));

    res.json({
      status: "success",
      data: formattedHostels,
      count: formattedHostels.length,
    });
  } catch (error) {
    console.error("Error fetching nearby hostels:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching nearby hostels",
      error: error.message,
    });
  }
};

module.exports = {
  getHostel,
  getHostels,
  getNearbyHostels,
};
