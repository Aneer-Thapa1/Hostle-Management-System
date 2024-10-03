import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  FaCalendarAlt,
  FaHotel,
  FaMoneyBillWave,
  FaSpinner,
  FaExclamationCircle,
  FaMapMarkedAlt,
  FaFilter,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchBookings = async (status, startDate, endDate) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  let url = `${apiUrl}/api/booking/userBookings`;
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.bookings;
};

const BookingHistory = () => {
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["bookingHistory", status, startDate, endDate],
    () => fetchBookings(status, startDate, endDate),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  const handleFilter = () => {
    refetch();
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          Your <span className="text-primaryColor">Booking History</span>
        </h1>

        <div className="mb-8 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaFilter className="mr-2 text-primaryColor" />
            Filter Bookings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-gray-700 text-white rounded-md p-2"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-700 text-white rounded-md p-2"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-700 text-white rounded-md p-2"
              placeholder="End Date"
            />
            <button
              onClick={handleFilter}
              className="bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-primaryColor-dark transition duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-primaryColor text-4xl" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            <FaExclamationCircle className="mr-2" />
            <span>Error loading booking history: {error.message}</span>
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <FaCalendarAlt className="mx-auto text-6xl text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">
              No bookings found for the selected criteria.
            </p>
            <p className="mt-2 text-gray-500">
              Try adjusting your filters or make a new booking!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const BookingCard = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500 text-white";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-500 text-white";
      case "ACCEPTED":
        return "bg-blue-500 text-white";
      case "PENDING":
        return "bg-yellow-500 text-gray-800";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">
          {booking.hostel?.hostelName || "Unknown Hostel"}
        </h3>
        <p className="text-gray-400 text-sm mb-4 flex items-center">
          <FaMapMarkedAlt className="mr-2" />
          {booking.hostel?.location || "Unknown Location"}
        </p>
        <div className="space-y-2 text-gray-300">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-primaryColor" />
            <span>
              Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-primaryColor" />
            <span>
              Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
            </span>
          </div>
          {booking.room && (
            <div className="flex items-center">
              <FaHotel className="mr-2 text-primaryColor" />
              <span>
                Room: {booking.room.roomIdentifier} ({booking.room.type})
              </span>
            </div>
          )}
          {booking.package && (
            <div className="flex items-center">
              <FaMoneyBillWave className="mr-2 text-primaryColor" />
              <span>Package: {booking.package.name}</span>
            </div>
          )}
          <div className="flex items-center">
            <FaMoneyBillWave className="mr-2 text-primaryColor" />
            <span>Total Amount: ${booking.totalAmount}</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-700 flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status}
        </span>
        <button className="bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-primaryColor-dark transition duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default BookingHistory;
