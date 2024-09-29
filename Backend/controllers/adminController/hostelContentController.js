const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const hostelContentController = {
  getHostelInfo: async (req, res) => {
    try {
      const id = req.user.user.id;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const hostelInfo = await prisma.hostelOwner.findUnique({
        where: { id },
        select: {
          hostelName: true,
          ownerName: true,
          email: true,
          contact: true,
          location: true,
          address: true,
          latitude: true,
          longitude: true,
          description: true,
          mainPhoto: true,
          avgRating: true,
        },
      });

      if (!hostelInfo) {
        return res.status(404).json({ message: "Hostel not found" });
      }

      res.json(hostelInfo);
    } catch (error) {
      console.error("Error fetching hostel info:", error);
      res
        .status(500)
        .json({ message: "Error fetching hostel info", error: error.message });
    }
  },

  updateHostelInfo: async (req, res) => {
    try {
      const id = req.user.user.id;
      const {
        hostelName,
        ownerName,
        email,
        contact,
        location,
        address,
        latitude,
        longitude,
        description,
        mainPhoto,
      } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const updatedHostel = await prisma.hostelOwner.update({
        where: { id },
        data: {
          hostelName,
          ownerName,
          email,
          contact,
          location,
          address,
          latitude,
          longitude,
          description,
          mainPhoto,
        },
      });

      res.json(updatedHostel);
    } catch (error) {
      console.error("Error updating hostel info:", error);
      res
        .status(500)
        .json({ message: "Error updating hostel info", error: error.message });
    }
  },

  getPackages: async (req, res) => {
    try {
      const id = parseInt(req.query.hostelId) || req.user.user.id;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const packages = await prisma.package.findMany({
        where: { hostelOwnerId: id },
      });
      console.log(packages);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res
        .status(500)
        .json({ message: "Error fetching packages", error: error.message });
    }
  },

  addPackage: async (req, res) => {
    try {
      const hostelId = req.user.user.id;
      const {
        name,
        description,
        price,
        duration,
        services,
        mealPlan,
        cancellationPolicy,
      } = req.body;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newPackage = await prisma.package.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          duration: parseInt(duration),
          services,
          mealPlan,
          cancellationPolicy,
          hostelOwner: { connect: { id: hostelId } },
        },
      });

      res.status(201).json(newPackage);
    } catch (error) {
      console.error("Error adding package:", error);
      res
        .status(500)
        .json({ message: "Error adding package", error: error.message });
    }
  },

  updatePackage: async (req, res) => {
    try {
      const packageId = parseInt(req.params.id, 10);
      const {
        name,
        description,
        price,
        duration,
        services,
        mealPlan,
        cancellationPolicy,
      } = req.body;

      if (isNaN(packageId)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }

      const updatedPackage = await prisma.package.update({
        where: { id: packageId },
        data: {
          name,
          description,
          price: parseFloat(price),
          duration: parseInt(duration),
          services,
          mealPlan,
          cancellationPolicy,
        },
      });

      res.json(updatedPackage);
    } catch (error) {
      console.error("Error updating package:", error);
      res
        .status(500)
        .json({ message: "Error updating package", error: error.message });
    }
  },

  deletePackage: async (req, res) => {
    try {
      const packageId = parseInt(req.params.id, 10);

      if (isNaN(packageId)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }

      await prisma.package.delete({ where: { id: packageId } });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting package:", error);
      res
        .status(500)
        .json({ message: "Error deleting package", error: error.message });
    }
  },

  getFacilities: async (req, res) => {
    try {
      const hostelId = req.user.user.id;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const facilities = await prisma.facility.findMany({
        where: { hostelOwnerId: hostelId },
      });
      console.log(facilities);
      res.json(facilities);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      res
        .status(500)
        .json({ message: "Error fetching facilities", error: error.message });
    }
  },

  addFacility: async (req, res) => {
    try {
      const hostelId = req.user.user.id;
      const { name, description, available, operatingHours } = req.body;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newFacility = await prisma.facility.create({
        data: {
          name,
          description,
          available,
          operatingHours,
          hostelOwner: { connect: { id: hostelId } },
        },
      });

      res.status(201).json(newFacility);
    } catch (error) {
      console.error("Error adding facility:", error);
      res
        .status(500)
        .json({ message: "Error adding facility", error: error.message });
    }
  },

  deleteFacility: async (req, res) => {
    try {
      const facilityId = parseInt(req.params.id, 10);

      if (isNaN(facilityId)) {
        return res.status(400).json({ message: "Invalid facility ID" });
      }

      await prisma.facility.delete({ where: { id: facilityId } });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting facility:", error);
      res
        .status(500)
        .json({ message: "Error deleting facility", error: error.message });
    }
  },

  getGalleryImages: async (req, res) => {
    try {
      const hostelId = req.user.user.id;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const images = await prisma.galleryImage.findMany({
        where: { hostelOwnerId: hostelId },
      });

      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({
        message: "Error fetching gallery images",
        error: error.message,
      });
    }
  },

  addGalleryImage: async (req, res) => {
    try {
      const hostelId = req.user.user.id;
      const { imageUrl, description } = req.body;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newImage = await prisma.galleryImage.create({
        data: {
          imageUrl,
          description,
          hostelOwner: { connect: { id: hostelId } },
        },
      });

      res.status(201).json(newImage);
    } catch (error) {
      console.error("Error adding gallery image:", error);
      res
        .status(500)
        .json({ message: "Error adding gallery image", error: error.message });
    }
  },

  deleteGalleryImage: async (req, res) => {
    try {
      const imageId = parseInt(req.params.id, 10);

      if (isNaN(imageId)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      await prisma.galleryImage.delete({ where: { id: imageId } });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({
        message: "Error deleting gallery image",
        error: error.message,
      });
    }
  },

  getMeals: async (req, res) => {
    try {
      const hostelId = req.user.user.id;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const meals = await prisma.meal.findMany({
        where: { hostelOwnerId: hostelId },
      });

      res.json(meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      res
        .status(500)
        .json({ message: "Error fetching meals", error: error.message });
    }
  },

  addMeal: async (req, res) => {
    try {
      const hostelId = req.user.user.id;
      const { name, description, price, isVegan, isGlutenFree, available } =
        req.body;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newMeal = await prisma.meal.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          isVegan,
          isGlutenFree,
          available,
          hostelOwner: { connect: { id: hostelId } },
        },
      });

      res.status(201).json(newMeal);
    } catch (error) {
      console.error("Error adding meal:", error);
      res
        .status(500)
        .json({ message: "Error adding meal", error: error.message });
    }
  },

  updateMeal: async (req, res) => {
    try {
      const mealId = parseInt(req.params.id, 10);
      const { name, description, price, isVegan, isGlutenFree, available } =
        req.body;

      if (isNaN(mealId)) {
        return res.status(400).json({ message: "Invalid meal ID" });
      }

      const updatedMeal = await prisma.meal.update({
        where: { id: mealId },
        data: {
          name,
          description,
          price: parseFloat(price),
          isVegan,
          isGlutenFree,
          available,
        },
      });

      res.json(updatedMeal);
    } catch (error) {
      console.error("Error updating meal:", error);
      res
        .status(500)
        .json({ message: "Error updating meal", error: error.message });
    }
  },

  deleteMeal: async (req, res) => {
    try {
      const mealId = parseInt(req.params.id, 10);

      if (isNaN(mealId)) {
        return res.status(400).json({ message: "Invalid meal ID" });
      }

      await prisma.meal.delete({ where: { id: mealId } });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting meal:", error);
      res
        .status(500)
        .json({ message: "Error deleting meal", error: error.message });
    }
  },

  getNearbyAttractions: async (req, res) => {
    try {
      const hostelId = req.user.user.id;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const attractions = await prisma.nearbyAttraction.findMany({
        where: { hostelOwnerId: hostelId },
      });

      res.json(attractions);
    } catch (error) {
      console.error("Error fetching nearby attractions:", error);
      res.status(500).json({
        message: "Error fetching nearby attractions",
        error: error.message,
      });
    }
  },

  addNearbyAttraction: async (req, res) => {
    try {
      const hostelId = req.user.user.id;
      const { name, distance, type, openingHours, description } = req.body;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newAttraction = await prisma.nearbyAttraction.create({
        data: {
          name,
          distance,
          type,
          openingHours,
          description,
          hostelOwner: { connect: { id: hostelId } },
        },
      });

      res.status(201).json(newAttraction);
    } catch (error) {
      console.error("Error adding nearby attraction:", error);
      res.status(500).json({
        message: "Error adding nearby attraction",
        error: error.message,
      });
    }
  },

  updateNearbyAttraction: async (req, res) => {
    try {
      const attractionId = parseInt(req.params.id, 10);
      const { name, distance, type, openingHours, description } = req.body;

      if (isNaN(attractionId)) {
        return res.status(400).json({ message: "Invalid attraction ID" });
      }

      const updatedAttraction = await prisma.nearbyAttraction.update({
        where: { id: attractionId },
        data: { name, distance, type, openingHours, description },
      });

      res.json(updatedAttraction);
    } catch (error) {
      console.error("Error updating nearby attraction:", error);
      res.status(500).json({
        message: "Error updating nearby attraction",
        error: error.message,
      });
    }
  },

  deleteNearbyAttraction: async (req, res) => {
    try {
      const attractionId = parseInt(req.params.id, 10);

      if (isNaN(attractionId)) {
        return res.status(400).json({ message: "Invalid attraction ID" });
      }

      await prisma.nearbyAttraction.delete({ where: { id: attractionId } });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting nearby attraction:", error);
      res.status(500).json({
        message: "Error deleting nearby attraction",
        error: error.message,
      });
    }
  },

  // New function to get rooms
  getRooms: async (req, res) => {
    try {
      const hostelId = req.user.user.id;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const rooms = await prisma.room.findMany({
        where: { hostelOwnerId: hostelId },
      });

      res.json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res
        .status(500)
        .json({ message: "Error fetching rooms", error: error.message });
    }
  },

  // New function to add a room
  addRoom: async (req, res) => {
    try {
      const hostelId = req.user.user.id;
      const {
        roomIdentifier,
        type,
        floor,
        amenities,
        status,
        capacity,
        description,
        price,
        roomCondition,
        dateAvailable,
      } = req.body;

      if (isNaN(hostelId)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newRoom = await prisma.room.create({
        data: {
          roomIdentifier,
          type,
          floor: parseInt(floor),
          amenities,
          status,
          capacity: parseInt(capacity),
          description,
          price: parseFloat(price),
          roomCondition,
          dateAvailable: new Date(dateAvailable),
          hostelOwner: { connect: { id: hostelId } },
        },
      });

      res.status(201).json(newRoom);
    } catch (error) {
      console.error("Error adding room:", error);
      res
        .status(500)
        .json({ message: "Error adding room", error: error.message });
    }
  },

  // New function to update a room
  updateRoom: async (req, res) => {
    try {
      const roomId = parseInt(req.params.id, 10);
      const {
        roomIdentifier,
        type,
        floor,
        amenities,
        status,
        capacity,
        description,
        price,
        roomCondition,
        dateAvailable,
      } = req.body;

      if (isNaN(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }

      const updatedRoom = await prisma.room.update({
        where: { id: roomId },
        data: {
          roomIdentifier,
          type,
          floor: parseInt(floor),
          amenities,
          status,
          capacity: parseInt(capacity),
          description,
          price: parseFloat(price),
          roomCondition,
          dateAvailable: new Date(dateAvailable),
        },
      });

      res.json(updatedRoom);
    } catch (error) {
      console.error("Error updating room:", error);
      res
        .status(500)
        .json({ message: "Error updating room", error: error.message });
    }
  },

  // New function to delete a room
  deleteRoom: async (req, res) => {
    try {
      const roomId = parseInt(req.params.id, 10);

      if (isNaN(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }

      await prisma.room.delete({ where: { id: roomId } });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting room:", error);
      res
        .status(500)
        .json({ message: "Error deleting room", error: error.message });
    }
  },
};

module.exports = hostelContentController;
