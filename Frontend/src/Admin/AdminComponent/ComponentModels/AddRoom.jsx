import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_PATH;

console.log("API URL:", apiUrl);

const axiosInstance = axios.create({
  baseURL: apiUrl,
});
const token = localStorage.getItem("token");
console.log(token);

axiosInstance.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("Outgoing Request Config:", config);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response Data:", response.data);
    return response;
  },
  (error) => {
    console.error("Response Error:", error.response || error);
    return Promise.reject(error);
  }
);

const AddRoom = ({ setModel, editData }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    roomIdentifier: "",
    type: "Double Bed",
    floor: "Floor 1",
    amenities: [],
    status: "Available",
    capacity: "",
    description: "",
    price: "",
  });
  const [error, setError] = useState(null);

  const addRoomMutation = useMutation(
    (newRoom) => {
      const token = localStorage.getItem("token");
      console.log("Token before API call:", token);
      if (!token) {
        throw new Error("No authentication token found");
      }
      return axiosInstance.post("/api/room/addRoom", newRoom);
    },
    {
      onSuccess: (data) => {
        console.log("Room added successfully:", data);
        queryClient.invalidateQueries("rooms");
        setModel(false);
      },
      onError: (error) => {
        console.error("Error adding room:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          setError(
            `Failed to add room: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      },
    }
  );

  const updateRoomMutation = useMutation(
    (updatedRoom) => {
      const token = localStorage.getItem("token");
      console.log("Token before API call:", token);
      if (!token) {
        throw new Error("No authentication token found");
      }
      return axiosInstance.put(`/api/room/${updatedRoom.id}`, updatedRoom);
    },
    {
      onSuccess: (data) => {
        console.log("Room updated successfully:", data);
        queryClient.invalidateQueries("rooms");
        setModel(false);
      },
      onError: (error) => {
        console.error("Error updating room:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          setError(
            `Failed to update room: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      },
    }
  );

  useEffect(() => {
    if (editData !== "") {
      setRoomData(editData);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editData === "") {
        await addRoomMutation.mutateAsync(roomData);
      } else {
        await updateRoomMutation.mutateAsync(roomData);
      }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editData === "" ? "Add a new room" : "Edit room details"}
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
                <option value="Double Bed">Double Bed</option>
                <option value="Single Bed">Single Bed</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="floor"
              >
                Floor
              </label>
              <select
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="floor"
                id="floor"
                value={roomData.floor}
              >
                <option value="Floor 1">Floor 1</option>
                <option value="Floor 2">Floor 2</option>
                <option value="Floor 3">Floor 3</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="capacity"
              >
                Capacity
              </label>
              <input
                onChange={handleChange}
                required
                type="number"
                value={roomData.capacity}
                name="capacity"
                placeholder="Enter room capacity"
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
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Reserved">Reserved</option>
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
              disabled={
                addRoomMutation.isLoading || updateRoomMutation.isLoading
              }
            >
              {addRoomMutation.isLoading || updateRoomMutation.isLoading
                ? "Processing..."
                : editData === ""
                ? "Add Room"
                : "Update Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
