import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaSpinner,
  FaExclamationCircle,
  FaMapMarkedAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchFavorites = async (page = 1) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/favorite/favorites?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const Favorites = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useQuery(
    ["favorites", currentPage],
    () => fetchFavorites(currentPage),
    {
      keepPreviousData: true,
    }
  );

  const favorites = data?.favorites || [];
  const totalCount = data?.totalCount || 0;

  const totalPages = Math.ceil(totalCount / favorites.length);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          Your <span className="text-primaryColor">Favorites</span>
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-primaryColor text-4xl" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            <FaExclamationCircle className="mr-2" />
            <span>Error loading favorites: {error.message}</span>
          </div>
        ) : favorites.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((hostel) => (
                <FavoriteHostelCard key={hostel.id} hostel={hostel} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="mx-1 px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>
                <span className="mx-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="mx-1 px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <FaHeart className="mx-auto text-6xl text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">
              You haven't added any hostels to your favorites yet.
            </p>
            <p className="mt-2 text-gray-500">
              Explore hostels and add them to your favorites!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const FavoriteHostelCard = ({ hostel }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/hostel/${hostel.id}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-white">{hostel.name}</h2>
        <p className="text-gray-400 text-sm mb-4 flex items-center">
          <FaMapMarkedAlt className="mr-2" />
          {hostel.location}
        </p>
      </div>
      <div className="px-6 py-4 bg-gray-700 flex justify-between items-center">
        <button
          onClick={handleViewDetails}
          className="bg-primaryColor text-white px-4 py-2 rounded-md hover:bg-primaryColor-dark transition duration-300"
        >
          View Details
        </button>
        <button className="text-red-500 hover:text-red-600">
          <FaHeart className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default Favorites;
