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
          description: true,
          location: true,
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
      const { hostelId } = req.params;
      const { name, description, location } = req.body;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const updatedHostel = await prisma.hostelOwner.update({
        where: { id },
        data: {
          hostelName: name,
          description,
          location,
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
      const { hostelId } = req.params;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const packages = await prisma.package.findMany({
        where: { hostelOwnerId: id },
      });

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
      const { hostelId } = req.params;
      const { name, description, price } = req.body;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newPackage = await prisma.package.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          hostelOwner: { connect: { id } },
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
      const { packageId } = req.params;
      const { name, description, price } = req.body;

      const id = parseInt(packageId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }

      const updatedPackage = await prisma.package.update({
        where: { id },
        data: { name, description, price: parseFloat(price) },
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
      const { packageId } = req.params;

      const id = parseInt(packageId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
      }

      await prisma.package.delete({ where: { id } });

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
      const { hostelId } = req.params;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const facilities = await prisma.facility.findMany({
        where: { hostelOwnerId: id },
      });

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
      const { hostelId } = req.params;
      const { name } = req.body;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newFacility = await prisma.facility.create({
        data: {
          name,
          hostelOwner: { connect: { id } },
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
      const { facilityId } = req.params;

      const id = parseInt(facilityId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid facility ID" });
      }

      await prisma.facility.delete({ where: { id } });

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
      const { hostelId } = req.params;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const images = await prisma.galleryImage.findMany({
        where: { hostelOwnerId: id },
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
      const { hostelId } = req.params;
      const { imageUrl } = req.body;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newImage = await prisma.galleryImage.create({
        data: {
          imageUrl,
          hostelOwner: { connect: { id } },
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
      const { imageId } = req.params;

      const id = parseInt(imageId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      await prisma.galleryImage.delete({ where: { id } });

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
      const { hostelId } = req.params;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const meals = await prisma.meal.findMany({
        where: { hostelOwnerId: id },
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
      const { hostelId } = req.params;
      const { name, description } = req.body;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newMeal = await prisma.meal.create({
        data: {
          name,
          description,
          hostelOwner: { connect: { id } },
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
      const { mealId } = req.params;
      const { name, description } = req.body;

      const id = parseInt(mealId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meal ID" });
      }

      const updatedMeal = await prisma.meal.update({
        where: { id },
        data: { name, description },
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
      const { mealId } = req.params;

      const id = parseInt(mealId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meal ID" });
      }

      await prisma.meal.delete({ where: { id } });

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
      const { hostelId } = req.params;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const attractions = await prisma.nearbyAttraction.findMany({
        where: { hostelOwnerId: id },
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
      const { hostelId } = req.params;
      const { name, distance } = req.body;

      const id = parseInt(hostelId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid hostel ID" });
      }

      const newAttraction = await prisma.nearbyAttraction.create({
        data: {
          name,
          distance,
          hostelOwner: { connect: { id } },
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
      const { attractionId } = req.params;
      const { name, distance } = req.body;

      const id = parseInt(attractionId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attraction ID" });
      }

      const updatedAttraction = await prisma.nearbyAttraction.update({
        where: { id },
        data: { name, distance },
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
      const { attractionId } = req.params;

      const id = parseInt(attractionId, 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attraction ID" });
      }

      await prisma.nearbyAttraction.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting nearby attraction:", error);
      res.status(500).json({
        message: "Error deleting nearby attraction",
        error: error.message,
      });
    }
  },
};

module.exports = hostelContentController;
