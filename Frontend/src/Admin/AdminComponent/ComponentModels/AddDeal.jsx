import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

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

const AddDeal = ({ setModel, editData, refetchDeals }) => {
  const queryClient = useQueryClient();
  const [dealData, setDealData] = useState({
    name: "",
    roomType: "Single Bed",
    discount: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editData) {
      setDealData({
        ...editData,
        startDate: editData.startDate.split("T")[0],
        endDate: editData.endDate.split("T")[0],
      });
    }
  }, [editData]);

  const addDealMutation = useMutation(
    (newDeal) => axiosInstance.post("/api/deals/addDeal", newDeal),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("deals");
        refetchDeals();
        setModel(false);
      },
      onError: (error) => {
        console.error("Error adding deal:", error);
        setError(
          `Failed to add deal: ${
            error.response?.data?.message || error.message
          }`
        );
      },
    }
  );

  const updateDealMutation = useMutation(
    (updatedDeal) =>
      axiosInstance.put(`/api/deals/updateDeal/${updatedDeal.id}`, updatedDeal),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("deals");
        refetchDeals();
        setModel(false);
      },
      onError: (error) => {
        console.error("Error updating deal:", error);
        setError(
          `Failed to update deal: ${
            error.response?.data?.message || error.message
          }`
        );
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editData) {
        await updateDealMutation.mutateAsync({ ...dealData, id: editData.id });
      } else {
        await addDealMutation.mutateAsync(dealData);
      }
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDealData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editData ? "Edit Deal" : "Add New Deal"}
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
                htmlFor="name"
              >
                Deal Name
              </label>
              <input
                onChange={handleChange}
                required
                type="text"
                name="name"
                value={dealData.name}
                placeholder="Enter deal name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="roomType"
              >
                Room Type
              </label>
              <select
                onChange={handleChange}
                name="roomType"
                value={dealData.roomType}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Single Bed">Single Bed</option>
                <option value="Double Bed">Double Bed</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="discount"
              >
                Discount (%)
              </label>
              <input
                onChange={handleChange}
                required
                type="number"
                name="discount"
                value={dealData.discount}
                placeholder="Enter discount percentage"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="startDate"
              >
                Start Date
              </label>
              <input
                onChange={handleChange}
                required
                type="date"
                name="startDate"
                value={dealData.startDate}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="endDate"
              >
                End Date
              </label>
              <input
                onChange={handleChange}
                required
                type="date"
                name="endDate"
                value={dealData.endDate}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              name="description"
              value={dealData.description}
              placeholder="Enter deal description"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
              disabled={
                addDealMutation.isLoading || updateDealMutation.isLoading
              }
            >
              {addDealMutation.isLoading || updateDealMutation.isLoading
                ? "Processing..."
                : editData
                ? "Update Deal"
                : "Add Deal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeal;
