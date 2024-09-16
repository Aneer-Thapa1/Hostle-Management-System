import React from "react";
import { FaCalendar, FaPercent, FaBed, FaStar } from "react-icons/fa";

const PackageSummary = ({ deals }) => {
  if (!deals || deals.length === 0) {
    return (
      <div className="text-white text-center py-8">
        No package deals available at the moment.
      </div>
    );
  }

  const getDiscountColor = (discount) => {
    if (discount >= 50) return "text-red-500";
    if (discount >= 30) return "text-yellow-500";
    return "text-green-500";
  };

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
