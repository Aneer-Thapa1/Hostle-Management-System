import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
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

const ROWS_PER_PAGE = 8;

const fetchDeals = async ({ queryKey }) => {
  const [_key, { page, limit, sortBy, sortOrder, roomType }] = queryKey;
  const endpoint = "/api/deals/getDeals";
  const params = { page, limit, sortBy, sortOrder, roomType };
  if (roomType && roomType !== "all") {
    params.roomType = roomType;
  }
  const response = await axiosInstance.get(endpoint, { params });
  return response.data;
};

const deleteDeal = async (dealId) => {
  await axiosInstance.delete(`/api/deals/deleteDeal/${dealId}`);
};

const AdminDeal = () => {
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [editDealData, setEditDealData] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [page, setPage] = useState(1);
  const [sortBy] = useState("createdAt");
  const [sortOrder] = useState("desc");

  const queryClient = useQueryClient();

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
      onError: (error) => {
        console.error("Error fetching deals:", error);
      },
    }
  );

  const deleteMutation = useMutation(deleteDeal, {
    onSuccess: () => {
      queryClient.invalidateQueries("deals");
    },
    onError: (error) => {
      console.error("Error deleting deal:", error);
      alert("Failed to delete deal. Please try again.");
    },
  });

  const openAddDealForm = () => {
    setEditDealData(null);
    setShowAddDeal(true);
  };

  const editDeal = (deal) => {
    setEditDealData(deal);
    setShowAddDeal(true);
  };

  const handleRoomTypeChange = (roomType) => {
    setSelectedRoomType(roomType);
    setPage(1);
    refetch().catch((error) => console.error("Error refetching deals:", error));
  };

  const handleDelete = (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      deleteMutation.mutate(dealId);
    }
  };

  const renderFacilities = (facilities) => {
    if (!facilities) return "No facilities";
    if (typeof facilities === "string") {
      try {
        facilities = JSON.parse(facilities);
      } catch (e) {
        return facilities;
      }
    }
    if (Array.isArray(facilities)) {
      return facilities.join(", ");
    }
    return String(facilities);
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

  const deals = data?.data || [];
  const totalItems = data?.meta?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);

  return (
    <div className="w-full h-full flex flex-col bg-white p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Deal Management</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {["all", "Single", "Double", "Triple", "Quad"].map((roomType) => (
            <button
              key={roomType}
              onClick={() => handleRoomTypeChange(roomType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                ${
                  selectedRoomType === roomType
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {roomType === "all" ? "All Deals" : `${roomType} Room`}
            </button>
          ))}
        </div>
        <button
          onClick={openAddDealForm}
          className="bg-green-500 text-white font-medium rounded-md px-4 py-2 hover:bg-green-600 transition-colors duration-200"
        >
          Add New Deal
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Deal Name",
                "Room Type",
                "Price (Monthly)",
                "Facilities",
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
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {deal.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {deal.roomType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${deal.monthlyPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renderFacilities(deal.facilities)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => editDeal(deal)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <CiEdit className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id)}
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
