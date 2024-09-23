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
        deals: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            description: true,
            packageType: true,
            basePrice: true,
            discountPrice: true,
            maxOccupancy: true,
            amenities: true,
            features: true,
            isActive: true,
            termsAndConditions: true,
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
    hostelData.rooms = hostelData.rooms.map((room) => ({
      ...room,
      amenities: room.amenities ? JSON.parse(room.amenities) : [],
    }));

    // Calculate minimum price from deals
    const minDealPrice =
      hostelData.deals.length > 0
        ? Math.min(...hostelData.deals.map((deal) => deal.discountPrice))
        : null;

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
      rooms: hostelData.rooms,
      deals: hostelData.deals,
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

    if (maxPrice || minPrice) {
      whereClause.rooms = {
        some: {
          AND: [
            minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
            maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
          ],
        },
      };
    }

    // Fetch hostels and user's favorites
    const [hostels, totalCount, userFavorites] = await Promise.all([
      prisma.hostelOwner.findMany({
        where: whereClause,
        include: {
          rooms: {
            select: {
              price: true,
              amenities: true,
            },
          },
        },
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
    let formattedHostels = hostels.map((hostel) => ({
      id: hostel.id,
      name: hostel.hostelName,
      location: hostel.location,
      description: hostel.description,
      price: Math.min(...hostel.rooms.map((room) => room.price)),
      rating: hostel.avgRating || 0,
      image: hostel.mainPhoto || "default_image_url",
      amenities: [
        ...new Set(hostel.rooms.flatMap((room) => JSON.parse(room.amenities))),
      ],
      isFavorite: favoriteHostelIds.has(hostel.id),
    }));

    // Improved sorting algorithm (Quick Sort)
    const quickSort = (arr, low, high) => {
      if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
      }
    };

    const partition = (arr, low, high) => {
      const pivot = arr[high][sortBy];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (
          (sortOrder === "asc" && arr[j][sortBy] <= pivot) ||
          (sortOrder === "desc" && arr[j][sortBy] >= pivot)
        ) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      return i + 1;
    };

    // Sort the formatted hostels
    quickSort(formattedHostels, 0, formattedHostels.length - 1);

    // Binary search function to find hostels within a specific price range
    const binarySearchPrice = (arr, target, comparator) => {
      let left = 0;
      let right = arr.length - 1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (comparator(arr[mid].price, target)) {
          return mid;
        } else if (arr[mid].price < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      return -1;
    };

    // Apply binary search if minPrice or maxPrice is specified
    if (minPrice || maxPrice) {
      const minPriceValue = parseFloat(minPrice) || 0;
      const maxPriceValue = parseFloat(maxPrice) || Infinity;

      const lowerBound = binarySearchPrice(
        formattedHostels,
        minPriceValue,
        (price, target) => price >= target
      );
      const upperBound = binarySearchPrice(
        formattedHostels,
        maxPriceValue,
        (price, target) => price > target
      );

      if (lowerBound !== -1) {
        formattedHostels = formattedHostels.slice(
          lowerBound,
          upperBound !== -1 ? upperBound : undefined
        );
      } else {
        formattedHostels = [];
      }
    }

    // Apply pagination
    const paginatedHostels = formattedHostels.slice(skip, skip + pageSize);

    res.json({
      hostels: paginatedHostels,
      currentPage: pageNumber,
      totalPages: Math.ceil(formattedHostels.length / pageSize),
      totalCount: formattedHostels.length,
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

const allHostels = async (req, res) => {
  try {
    const hostels = await prisma.hostelOwner.findMany({
      select: {
        id: true,
        hostelName: true,
        latitude: true,
        longitude: true,
        location: true,
        address: true,
        avgRating: true,
        mainPhoto: true,
        rooms: {
          select: {
            price: true,
          },
          orderBy: {
            price: "asc",
          },
          take: 1,
        },
      },
    });

    const formattedHostels = hostels.map((hostel) => ({
      id: hostel.id,
      name: hostel.hostelName,
      latitude: hostel.latitude,
      longitude: hostel.longitude,
      location: hostel.location,
      address: hostel.address,
      rating: hostel.avgRating || 0,
      image: hostel.mainPhoto,
      price: hostel.rooms[0]?.price || null,
    }));

    res.status(200).json({
      status: "success",
      results: formattedHostels.length,
      hostels: formattedHostels,
    });
  } catch (error) {
    console.error("Error fetching all hostels:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching hostels",
    });
  }
};

module.exports = {
  getHostel,
  getHostels,
  getNearbyHostels,
  allHostels,
};
