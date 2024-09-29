import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_PATH;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AddRoom = ({ setModel, editData, refetchRooms }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    roomIdentifier: "",
    type: "DOUBLE",
    floor: 1,
    amenities: [],
    status: "AVAILABLE",
    totalCapacity: "",
    description: "",
    price: "",
    roomCondition: "GOOD",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editData) {
      setRoomData({
        ...editData,
        amenities: Array.isArray(editData.amenities)
          ? editData.amenities
          : JSON.parse(editData.amenities || "[]"),
      });
    }
  }, [editData]);

  const mutation = useMutation(
    (roomData) => {
      if (editData) {
        return axiosInstance.put(
          `/api/rooms/updateRoom/${editData.id}`,
          roomData
        );
      } else {
        return axiosInstance.post("/api/rooms/addRoom", roomData);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("rooms");
        refetchRooms();
        setModel(false);
      },
      onError: (error) => {
        console.error("Error in room operation:", error);
        handleError(error);
      },
    }
  );

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      navigate("/login");
    } else {
      setError(
        `Failed to ${editData ? "update" : "add"} room: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const dataToSubmit = {
        ...roomData,
        amenities: JSON.stringify(roomData.amenities),
        floor: parseInt(roomData.floor),
        totalCapacity: parseInt(roomData.totalCapacity),
        price: parseFloat(roomData.price),
      };
      await mutation.mutateAsync(dataToSubmit);
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setRoomData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((item) => item !== value),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editData ? "Edit room details" : "Add a new room"}
          </h2>
          <RxCross2
            onClick={() => setModel(false)}
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-800"
          />
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="roomIdentifier"
              >
                Room Number/Name
              </label>
              <input
                onChange={handleChange}
                required
                type="text"
                value={roomData.roomIdentifier}
                name="roomIdentifier"
                placeholder="Enter room number/name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="price"
              >
                Price
              </label>
              <input
                onChange={handleChange}
                required
                type="number"
                step="0.01"
                value={roomData.price}
                name="price"
                placeholder="Enter room price"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="type"
              >
                Room Type
              </label>
              <select
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="type"
                id="type"
                value={roomData.type}
              >
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="TRIPLE">Triple</option>
                <option value="QUAD">Quad</option>
                <option value="DORMITORY">Dormitory</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="floor"
              >
                Floor
              </label>
              <input
                onChange={handleChange}
                required
                type="number"
                value={roomData.floor}
                name="floor"
                placeholder="Enter floor number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="totalCapacity"
              >
                Total Capacity
              </label>
              <input
                onChange={handleChange}
                required
                type="number"
                value={roomData.totalCapacity}
                name="totalCapacity"
                placeholder="Enter total capacity"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="status"
              >
                Status
              </label>
              <select
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="status"
                id="status"
                value={roomData.status}
              >
                <option value="AVAILABLE">Available</option>
                <option value="FULLY_OCCUPIED">Fully Occupied</option>
                <option value="PARTIALLY_OCCUPIED">Partially Occupied</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="roomCondition"
              >
                Room Condition
              </label>
              <select
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="roomCondition"
                id="roomCondition"
                value={roomData.roomCondition}
              >
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="amenities"
            >
              Amenities
            </label>
            <div className="flex flex-wrap gap-4">
              {["Wi-Fi", "TV", "Air Conditioning", "Mini-bar", "Balcony"].map(
                (amenity) => (
                  <label key={amenity} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={amenity}
                      checked={roomData.amenities.includes(amenity)}
                      onChange={handleAmenitiesChange}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {amenity}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          <div className="mt-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              onChange={handleChange}
              required
              value={roomData.description}
              name="description"
              placeholder="Enter description of room"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading
                ? "Processing..."
                : editData
                ? "Update Room"
                : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
