const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getHostel = async (req, res) => {
  try {
    const hostelId = parseInt(req.params.id);

    const hostelData = await prisma.hostelOwner.findUnique({
      where: { id: hostelId },
      include: {
        rooms: {
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
        packages: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            services: true,
            mealPlan: true,
          },
        },
        facilities: {
          select: {
            id: true,
            name: true,
            description: true,
            available: true,
            operatingHours: true,
          },
        },
        galleryImages: {
          select: {
            id: true,
            imageUrl: true,
            description: true,
          },
        },
        meals: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            isVegan: true,
            isGlutenFree: true,
            available: true,
          },
        },
        nearbyAttractions: {
          select: {
            id: true,
            name: true,
            distance: true,
            type: true,
            openingHours: true,
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

    // Safely parse amenities JSON string for each room
    hostelData.rooms = hostelData.rooms.map((room) => ({
      ...room,
      amenities: safeJsonParse(room.amenities, []),
    }));

    // Safely parse services JSON string for each package
    hostelData.packages = hostelData.packages.map((pkg) => ({
      ...pkg,
      services: safeJsonParse(pkg.services, []),
    }));

    // Calculate minimum price from rooms and packages
    const minRoomPrice = Math.min(
      ...hostelData.rooms.map((room) => room.price)
    );
    const minPackagePrice =
      hostelData.packages.length > 0
        ? Math.min(...hostelData.packages.map((pkg) => pkg.price))
        : Infinity;
    const minPrice = Math.min(minRoomPrice, minPackagePrice);

    // Count number of rooms
    const roomCount = hostelData.rooms.length;

    // Count total capacity
    const totalCapacity = hostelData.rooms.reduce(
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
      avgRating: hostelData.avgRating,
      rooms: hostelData.rooms,
      packages: hostelData.packages,
      facilities: hostelData.facilities,
      galleryImages: hostelData.galleryImages,
      meals: hostelData.meals,
      nearbyAttractions: hostelData.nearbyAttractions,
      minPrice: minPrice,
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

// Helper function to safely parse JSON
function safeJsonParse(jsonString, defaultValue) {
  try {
    return jsonString ? JSON.parse(jsonString) : defaultValue;
  } catch (error) {
    console.warn("Failed to parse JSON string:", jsonString);
    return defaultValue;
  }
}

const getHostels = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      location = "",
      maxPrice,
      minPrice,
      sortBy = "price",
      sortOrder = "asc",
    } = req.query;
    const userId = req.user ? req.user.id : null;

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

    // Fetch hostels with their packages and other related data
    const [hostels, totalCount, userFavorites] = await Promise.all([
      prisma.hostelOwner.findMany({
        where: whereClause,
        include: {
          packages: {
            select: {
              id: true,
              name: true,
              price: true,
              duration: true,
            },
          },
          rooms: {
            select: {
              id: true,
              roomIdentifier: true,
              price: true,
              capacity: true,
            },
          },
          facilities: {
            select: {
              name: true,
              available: true,
            },
          },
          nearbyAttractions: {
            select: {
              name: true,
              distance: true,
            },
          },
          galleryImages: {
            select: {
              imageUrl: true,
            },
          },
        },
        skip,
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

    // Format hostel data and find the lowest package price
    const formattedHostels = hostels.map((hostel) => {
      const lowestPackagePrice =
        hostel.packages.length > 0
          ? Math.min(...hostel.packages.map((pkg) => pkg.price))
          : null;

      const lowestRoomPrice =
        hostel.rooms.length > 0
          ? Math.min(...hostel.rooms.map((room) => room.price))
          : null;

      const lowestPrice =
        lowestPackagePrice !== null && lowestRoomPrice !== null
          ? Math.min(lowestPackagePrice, lowestRoomPrice)
          : lowestPackagePrice || lowestRoomPrice;

      console.log(`Hostel ID: ${hostel.id}`);
      console.log(`Lowest Package Price: ${lowestPackagePrice}`);
      console.log(`Lowest Room Price: ${lowestRoomPrice}`);
      console.log(`Final Lowest Price: ${lowestPrice}`);

      return {
        id: hostel.id,
        name: hostel.hostelName,
        ownerName: hostel.ownerName,
        location: hostel.location,
        address: hostel.address,
        latitude: hostel.latitude,
        longitude: hostel.longitude,
        description: hostel.description,
        price: lowestPrice,
        rating: hostel.avgRating || 0,
        image: hostel.mainPhoto,
        facilities: hostel.facilities
          .filter((facility) => facility.available)
          .map((facility) => facility.name),
        nearbyAttractions: hostel.nearbyAttractions.map((attraction) => ({
          name: attraction.name,
          distance: attraction.distance,
        })),
        galleryImages: hostel.galleryImages.map((image) => image.imageUrl),
        isFavorite: favoriteHostelIds.has(hostel.id),
        packageCount: hostel.packages.length,
        roomCount: hostel.rooms.length,
      };
    });

    // Apply price filtering
    let filteredHostels = formattedHostels;
    if (minPrice || maxPrice) {
      filteredHostels = formattedHostels.filter(
        (hostel) =>
          hostel.price !== null &&
          (!minPrice || hostel.price >= parseFloat(minPrice)) &&
          (!maxPrice || hostel.price <= parseFloat(maxPrice))
      );
    }

    // Sorting
    const sortedHostels = filteredHostels.sort((a, b) => {
      if (a[sortBy] === null) return 1;
      if (b[sortBy] === null) return -1;
      if (sortOrder === "asc") {
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy];
      }
    });

    res.json({
      hostels: sortedHostels,
      currentPage: pageNumber,
      totalPages: Math.ceil(filteredHostels.length / pageSize),
      totalCount: filteredHostels.length,
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

    const mainHostelId = req.user.user.id;
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
    const mainId = parseInt(mainHostelId);

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

    if (isNaN(mainId)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid mainHostelId. Received: ${mainHostelId}`,
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
      WHERE id != ${mainId}
      HAVING distance <= ${rad}
      ORDER BY distance
      LIMIT ${lim}
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
