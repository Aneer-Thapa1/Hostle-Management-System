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
    <div className="w-full absolute top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex justify-center items-center">
      <div className="w-full max-w-[500px] flex flex-col bg-white mx-auto py-5 px-10 border-[2px] rounded-md">
        <div className="w-full flex justify-between items-center">
          <span className="font-semibold text-xl mb-4 text-blue-500">
            {editData === "" ? "Add a new room" : "Edit room details"}
          </span>
          <RxCross2
            onClick={() => setModel(false)}
            className="w-6 h-6 cursor-pointer"
          />
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto bg-white  rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
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
              placeholder="Enter unique room number or name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="type"
              >
                Room Type
              </label>
              <select
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="type"
                id="type"
                value={roomData.type}
              >
                <option value="Double Bed">Double Bed</option>
                <option value="Single Bed">Single Bed</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="floor"
              >
                Floor
              </label>
              <select
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="floor"
                id="floor"
                value={roomData.floor}
              >
                <option value="Floor 1">Floor 1</option>
                <option value="Floor 2">Floor 2</option>
                <option value="Floor 3">Floor 3</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
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
                    <span className="ml-2 text-gray-700">{amenity}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            />
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="w-full md:w-1/3 px-3">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <select
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
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
