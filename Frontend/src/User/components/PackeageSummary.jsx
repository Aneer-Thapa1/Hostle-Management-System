import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  FaCalendar,
  FaPercent,
  FaBed,
  FaStar,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchPackages = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(`${apiUrl}/api/content/packages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const PackageSummary = () => {
  const {
    data: deals,
    isLoading,
    error,
  } = useQuery("packages", fetchPackages, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const getDiscountColor = (discount) => {
    if (discount >= 50) return "text-red-500";
    if (discount >= 30) return "text-yellow-500";
    return "text-green-500";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-primaryColor text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <FaExclamationCircle className="mr-2" />
        <span>Error loading packages: {error.message}</span>
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="text-white text-center py-8">
        No package deals available at the moment.
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Package Summary</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-tl-lg">
                Deal Name
              </th>
              <th scope="col" className="px-6 py-3">
                Room Type
              </th>
              <th scope="col" className="px-6 py-3">
                Discount
              </th>
              <th scope="col" className="px-6 py-3">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 rounded-tr-lg">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal, index) => (
              <tr
                key={deal.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                } hover:bg-gray-700 transition-colors duration-200`}
              >
                <td className="px-6 py-4 font-medium text-white">
                  {deal.name}
                  {deal.isFeatured && (
                    <span className="ml-2 text-yellow-500">
                      <FaStar />
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FaBed className="mr-2 text-primaryColor" />
                    {deal.roomType}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FaPercent
                      className={`mr-2 ${getDiscountColor(deal.discount)}`}
                    />
                    {deal.discount}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-blue-500" />
                    {new Date(deal.startDate).toLocaleDateString()} -{" "}
                    {new Date(deal.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {deal.description || "No description available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageSummary;
