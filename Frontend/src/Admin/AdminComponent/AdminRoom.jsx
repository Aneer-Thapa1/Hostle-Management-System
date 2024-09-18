import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import AddRoom from "../AdminComponent/ComponentModels/AddRoom";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

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

const ROWS_PER_PAGE = 8;

const fetchRooms = async ({ queryKey }) => {
  const [_key, { page, limit, sortBy, sortOrder, status }] = queryKey;
  const endpoint = "/api/rooms/getRooms";
  const params = { page, limit, sortBy, sortOrder, status };
  if (status && status !== "allRooms") {
    params.status = status;
  }
  const response = await axiosInstance.get(endpoint, { params });
  return response.data;
};

const deleteRoom = async (roomId) => {
  await axiosInstance.delete(`/api/rooms/deleteRoom/${roomId}`);
};

const AdminRoom = () => {
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editRoomData, setEditRoomData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("allRooms");
  const [page, setPage] = useState(1);
  const [sortBy] = useState("createdAt");
  const [sortOrder] = useState("desc");

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery(
    [
      "rooms",
      { page, limit: ROWS_PER_PAGE, sortBy, sortOrder, status: selectedStatus },
    ],
    fetchRooms,
    {
      keepPreviousData: true,
      staleTime: 5000,
      onError: (error) => {
        console.error("Error fetching rooms:", error);
      },
    }
  );

  const deleteMutation = useMutation(deleteRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries("rooms");
    },
    onError: (error) => {
      console.error("Error deleting room:", error);
      alert("Failed to delete room. Please try again.");
    },
  });

  const openAddRoomForm = () => {
    setEditRoomData(null);
    setShowAddRoom(true);
  };

  const editRoom = (room) => {
    setEditRoomData(room);
    setShowAddRoom(true);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setPage(1);
    refetch().catch((error) => console.error("Error refetching rooms:", error));
  };

  const handleDelete = (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      deleteMutation.mutate(roomId);
    }
  };

  const parseAmenities = (amenities) => {
    if (Array.isArray(amenities)) {
      return amenities.join(", ");
    }
    if (typeof amenities === "string") {
      try {
        const parsedAmenities = JSON.parse(amenities);
        if (Array.isArray(parsedAmenities)) {
          return parsedAmenities.join(", ");
        }
        return String(parsedAmenities);
      } catch (error) {
        console.error("Error parsing amenities:", error);
        return amenities; // Return the original string if parsing fails
      }
    }
    return "No amenities";
  };

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Error: {error?.message || "An error occurred"}
      </div>
    );

  const rooms = data?.data || [];
  const totalItems = data?.meta?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);

  return (
    <div className="w-full h-full flex flex-col bg-white p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Room Management</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {["allRooms", "Available", "Booked", "Reserved"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                ${
                  selectedStatus === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {status === "allRooms" ? "All Rooms" : status}
            </button>
          ))}
        </div>
        <button
          onClick={openAddRoomForm}
          className="bg-green-500 text-white font-medium rounded-md px-4 py-2 hover:bg-green-600 transition-colors duration-200"
        >
          Add New Room
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Room Number",
                "Type",
                "Floor",
                "Amenities",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {room.roomIdentifier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {room.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {room.floor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {parseAmenities(room.amenities)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      room.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : room.status === "Booked"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => editRoom(room)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <CiEdit className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <MdDeleteOutline className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-700">
          Showing {Math.min((page - 1) * ROWS_PER_PAGE + 1, totalItems)} to{" "}
          {Math.min(page * ROWS_PER_PAGE, totalItems)} of {totalItems} results
        </p>
        <div className="flex items-center">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="mr-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
            disabled={page === totalPages}
            className="ml-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      {showAddRoom && (
        <AddRoom
          setModel={setShowAddRoom}
          editData={editRoomData}
          refetchRooms={refetch}
        />
      )}
    </div>
  );
};

export default AdminRoom;
