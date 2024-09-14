import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import AddDeal from "./ComponentModels/AddDeal";

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

const fetchDeals = async ({ queryKey }) => {
  const [_key, { page, limit, sortBy, sortOrder, roomType }] = queryKey;
  const endpoint = "/api/deals/getDeals";

  const params = { page, limit, sortBy, sortOrder };
  if (roomType && roomType !== "allRooms") {
    params.roomType = roomType;
  }

  console.log("Fetching deals with params:", params);
  const response = await axiosInstance.get(endpoint, { params });
  console.log("API response:", response.data);
  return response.data;
};

const AdminDeal = () => {
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [editDealData, setEditDealData] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState("allRooms");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data, isLoading, isError, error, refetch } = useQuery(
    [
      "deals",
      {
        page,
        limit: ROWS_PER_PAGE,
        sortBy,
        sortOrder,
        roomType: selectedRoomType,
      },
    ],
    fetchDeals,
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

  const openAddDealForm = () => {
    setEditDealData(null);
    setShowAddDeal(true);
  };

  const editDeal = (deal) => {
    setEditDealData(deal);
    setShowAddDeal(true);
  };

  const handleRoomTypeChange = (roomType) => {
    console.log("Room type changed to:", roomType);
    setSelectedRoomType(roomType);
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

  const deals = data?.data || [];
  const totalItems = data?.meta?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);

  const filledDeals = [...deals];
  while (filledDeals.length < ROWS_PER_PAGE) {
    filledDeals.push({ id: `empty-${filledDeals.length}`, isEmpty: true });
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <h1 className="text-[#636363] font-medium mb-3">Deals</h1>

      {/* Room Type Filters */}
      <div className="flex gap-3 mb-3 text-sm">
        <div className="flex gap-3 flex-grow">
          {["allRooms", "Single Bed", "Double Bed", "Suite"].map((roomType) => (
            <div
              key={roomType}
              onClick={() => handleRoomTypeChange(roomType)}
              className={`px-3 py-2 flex gap-1 ${
                selectedRoomType === roomType
                  ? "border-[1px] border-blue-500 bg-blue-100 text-blue-500"
                  : "border-[1px] border-[#636363] text-[#636363]"
              } rounded-full font-medium cursor-pointer active:scale-90 transition-bg duration-300`}
            >
              <span>{roomType === "allRooms" ? "All Rooms" : roomType}</span>
              <span>
                ({roomType === selectedRoomType ? totalItems : "..."})
              </span>
            </div>
          ))}
        </div>

        {/* ADD DEAL BUTTON */}
        <button
          onClick={openAddDealForm}
          className="bg-blue-500 text-white font-medium rounded-md px-3 py-1 active:scale-95 transition-all ease-in-out"
        >
          Add Deal
        </button>
      </div>

      {/* TABLE */}
      <div className="flex-grow border-[1px] border-blue-100 rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Deal Name
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Room Type
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Discount
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Start Date
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                End Date
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filledDeals.map((deal) => (
              <tr
                key={deal.id}
                className={`border-t border-blue-100 ${
                  deal.isEmpty ? "h-[43px]" : ""
                }`}
              >
                {!deal.isEmpty ? (
                  <>
                    <td className="pl-4 py-2 text-blue-600">{deal.name}</td>
                    <td className="pl-4 py-2 text-[#636363]">
                      {deal.roomType}
                    </td>
                    <td className="pl-4 py-2 text-[#636363]">
                      {deal.discount}%
                    </td>
                    <td className="pl-4 py-2 text-[#636363]">
                      {new Date(deal.startDate).toLocaleDateString()}
                    </td>
                    <td className="pl-4 py-2 text-[#636363]">
                      {new Date(deal.endDate).toLocaleDateString()}
                    </td>
                    <td className="pl-4 py-2">
                      <div className="flex gap-4">
                        <CiEdit
                          onClick={() => editDeal(deal)}
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

      {/* AddDeal Modal */}
      {showAddDeal && (
        <AddDeal
          setModel={setShowAddDeal}
          editData={editDealData}
          refetchDeals={refetch}
        />
      )}
    </div>
  );
};

export default AdminDeal;
