import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/booking/getBookings");
      setBookings(response.data.bookings || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/rooms/roomDetails", {
        params: { status: "available" },
      });
      setRooms(response.data.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch rooms");
      console.error(err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    setSelectedBookingId(id);
    await fetchRooms();
    setShowRoomPopup(true);
  };

  const handleRoomSelect = async () => {
    if (!selectedRoomId) {
      setError("Please select a room");
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post(`/api/booking/acceptBooking`, {
        bookingId: selectedBookingId,
        roomId: selectedRoomId,
      });
      setShowRoomPopup(false);
      setSelectedBookingId(null);
      setSelectedRoomId("");
      fetchBookings();
      setError("");
    } catch (err) {
      setError("Failed to accept booking");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      try {
        setLoading(true);
        await axiosInstance.put(`/api/booking/bookings/${id}`, {
          status: "rejected",
        });
        fetchBookings();
      } catch (err) {
        setError("Failed to reject booking");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && !showRoomPopup) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Management</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b">Package Name</th>
                <th className="px-4 py-2 border-b">Check-In Date</th>
                <th className="px-4 py-2 border-b">Check-Out Date</th>
                <th className="px-4 py-2 border-b">Number of Students</th>
                <th className="px-4 py-2 border-b">Total Price</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-2">
                    {booking.package ? booking.package.name : "N/A"}
                  </td>
                  <td className="border-b px-4 py-2">
                    {formatDate(booking.checkInDate)}
                  </td>
                  <td className="border-b px-4 py-2">
                    {formatDate(booking.checkOutDate)}
                  </td>
                  <td className="border-b px-4 py-2">
                    {booking.numberOfStudents}
                  </td>
                  <td className="border-b px-4 py-2">
                    ${booking.totalPrice.toFixed(2)}
                  </td>
                  <td className="border-b px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        booking.status === "confirmed"
                          ? "bg-green-200 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : booking.status === "rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="border-b px-4 py-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(booking.id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2 transition duration-300"
                          disabled={loading}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition duration-300"
                          disabled={loading}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status !== "pending" && (
                      <span className="text-gray-500">
                        No actions available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRoomPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Select a Room</h2>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomIdentifier} ({room.type})
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleRoomSelect}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 transition duration-300"
                disabled={loading}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowRoomPopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
