import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import AddRoom from "./ComponentModels/AddRoom";

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

const ROWS_PER_PAGE = 10;

const fetchRooms = async ({ queryKey }) => {
  const [_key, { page, limit, sortBy, sortOrder, status }] = queryKey;
  const endpoint = "/api/rooms/getRooms";

  const params = { page, limit, sortBy, sortOrder };
  if (status && status !== "allRoom") {
    params.status = status;
  }

  console.log("Fetching rooms with params:", params);
  const response = await axiosInstance.get(endpoint, { params });
  console.log("API response:", response.data);
  return response.data;
};

const AdminRoom = ({ setModel, setEditData }) => {
  const [selectedOptions, setOption] = useState("allRoom");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data, isLoading, isError, error, refetch } = useQuery(
    [
      "rooms",
      {
        page,
        limit: ROWS_PER_PAGE,
        sortBy,
        sortOrder,
        status: selectedOptions,
      },
    ],
    fetchRooms,
    {
      keepPreviousData: true,
      staleTime: 5000,
      onSuccess: (data) => {
        console.log("Query succeeded. Received data:", data);
      },
      onError: (error) => {
        console.error("Query failed:", error);
      },
    }
  );

  const openAddForm = () => {
    setEditData("");
    setModel(true);
  };

  const EditRoomData = (room) => {
    setEditData(room);
    setModel(true);
  };

  const handleStatusChange = (status) => {
    console.log("Status changed to:", status);
    setOption(status);
    setPage(1);
    refetch();
  };

  if (isLoading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );

  const rooms = data?.data || [];
  const totalItems = data?.meta?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);

  const filledRooms = [...rooms];
  while (filledRooms.length < ROWS_PER_PAGE) {
    filledRooms.push({ id: `empty-${filledRooms.length}`, isEmpty: true });
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <h1 className="text-[#636363] font-medium mb-3">Rooms</h1>

      {/* options and Add Room button */}
      <div className="flex gap-3 mb-3 text-sm">
        <div className="flex gap-3 flex-grow">
          {["allRoom", "Available", "Booked", "Reserved"].map((option) => (
            <div
              key={option}
              onClick={() => handleStatusChange(option)}
              className={`px-3 py-2 flex gap-1 ${
                selectedOptions === option
                  ? "border-[1px] border-blue-500 bg-blue-100 text-blue-500"
                  : "border-[1px] border-[#636363] text-[#636363]"
              } rounded-full font-medium cursor-pointer active:scale-90 transition-bg duration-300`}
            >
              <span>{option === "allRoom" ? "All rooms" : option}</span>
              <span>({option === selectedOptions ? totalItems : "..."})</span>
            </div>
          ))}
        </div>

        {/* ADD ROOM BUTTON - Always visible */}
        <button
          onClick={openAddForm}
          className="bg-blue-500 text-white font-medium rounded-md px-3 py-1 active:scale-95 transition-all ease-in-out"
        >
          Add Room
        </button>
      </div>

      {totalItems > 0 ? (
        <>
          {/* TABLE  */}
          <div className="flex-grow border-[1px] border-blue-100 rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                    Room number
                  </th>
                  <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                    Bed type
                  </th>
                  <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                    Room floor
                  </th>
                  <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                    Room facility
                  </th>
                  <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                    Status
                  </th>
                  <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filledRooms.map((room) => (
                  <tr
                    key={room.id}
                    className={`border-t border-blue-100 ${
                      room.isEmpty ? "h-[43px]" : ""
                    }`}
                  >
                    {!room.isEmpty ? (
                      <>
                        <td className="pl-4 py-2 text-blue-600">
                          {room.roomIdentifier}
                        </td>
                        <td className="pl-4 py-2 text-[#636363]">
                          {room.type}
                        </td>
                        <td className="pl-4 py-2 text-[#636363]">
                          {room.floor}
                        </td>
                        <td className="pl-4 py-2 text-[#636363]">
                          {Array.isArray(room.amenities)
                            ? room.amenities.map((amenity, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1"
                                >
                                  {amenity}
                                </span>
                              ))
                            : room.amenities}
                        </td>
                        <td className="pl-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              room.status === "Available"
                                ? "bg-blue-100 text-blue-500"
                                : room.status === "Reserved"
                                ? "bg-green-100 text-green-500"
                                : "bg-orange-100 text-orange-500"
                            }`}
                          >
                            {room.status}
                          </span>
                        </td>
                        <td className="pl-4 py-2">
                          <div className="flex gap-4">
                            <CiEdit
                              onClick={() => EditRoomData(room)}
                              className="w-6 h-6 cursor-pointer text-blue-500 hover:text-blue-700"
                            />
                            <MdDeleteOutline className="w-6 h-6 cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </>
                    ) : (
                      <td colSpan="6"></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                setPage((old) => Math.max(old - 1, 1));
                refetch();
              }}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => {
                setPage((old) => Math.min(old + 1, totalPages));
                refetch();
              }}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">
            No rooms found. Click "Add Room" to create a new room.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminRoom;
