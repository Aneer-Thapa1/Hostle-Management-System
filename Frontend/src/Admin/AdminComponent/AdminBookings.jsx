import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";
const socket = io(apiUrl);

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    fetchBookings();

    // Set up Socket.IO listener
    socket.on("newBooking", (newBooking) => {
      setBookings((prevBookings) => [newBooking, ...prevBookings]);
      toast.info(`New booking received from ${newBooking.user.name}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });

    // Cleanup function
    return () => {
      socket.off("newBooking");
    };
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/booking/getBookings", {
        params: { status: statusFilter },
      });
      setBookings(response.data.bookings || []);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axiosInstance.post(`/api/booking/acceptBooking`, { bookingId: id });
      fetchBookings();
    } catch (err) {
      console.error("Error accepting booking:", err);
      setError("Failed to accept booking. Please try again.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.post(`/api/booking/rejectBooking`, { bookingId: id });
      fetchBookings();
    } catch (err) {
      console.error("Error rejecting booking:", err);
      setError("Failed to reject booking. Please try again.");
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedBookings = React.useMemo(() => {
    let sortableBookings = [...bookings];
    if (sortConfig.key) {
      sortableBookings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBookings;
  }, [bookings, sortConfig]);

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === "ascending" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      );
    }
    return <FaSort />;
  };

  // Get current bookings
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 h-fit">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
        <div className="flex items-center">
          <label
            htmlFor="statusFilter"
            className="mr-2 text-sm font-medium text-gray-700"
          >
            Filter:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-red-500 mb-4 p-3 bg-red-100 rounded">{error}</p>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("checkInDate")}
              >
                Check-In {getSortIcon("checkInDate")}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("checkOutDate")}
              >
                Check-Out {getSortIcon("checkOutDate")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(booking.checkInDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(booking.checkOutDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {booking.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleAccept(booking.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">No actions available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {[
          ...Array(Math.ceil(sortedBookings.length / bookingsPerPage)).keys(),
        ].map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={`mx-1 px-3 py-1 rounded transition-colors duration-200 ${
              currentPage === number + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings;
