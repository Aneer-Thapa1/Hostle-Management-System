import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  FaSearch,
  FaRegCalendar,
  FaMapMarkedAlt,
  FaHeart,
  FaStar,
  FaFilter,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const baseURL = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const Hostels = () => {
  const [hostels, setHostels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    maxPrice: "",
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchHostels = useCallback(
    async (reset = false) => {
      try {
        const response = await axios.get(`${baseURL}/api/hostel/hostels`, {
          params: {
            page: reset ? 1 : page,
            limit: 9,
            search: searchQuery,
            ...filters,
          },
          headers: getAuthHeader(),
        });
        const newHostels = response.data.hostels;
        setHostels((prev) => (reset ? newHostels : [...prev, ...newHostels]));
        setHasMore(page < response.data.totalPages);
        setPage((prev) => (reset ? 2 : prev + 1));
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    },
    [page, searchQuery, filters]
  );

  const fetchFavorites = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${baseURL}/api/favorite/favorites`, {
        headers: getAuthHeader(),
      });
      setFavorites(response.data.favorites.map((fav) => fav.id));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, []);

  useEffect(() => {
    fetchHostels(true);
    fetchFavorites();
  }, [searchQuery, filters]);

  const handleSearch = () => {
    fetchHostels(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchHostels(true);
    setFilterOpen(false);
  };

  const toggleFavorite = async (hostelId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("User not logged in");
        return;
      }

      const isFavorite = favorites.includes(hostelId);
      const endpoint = `${baseURL}/api/favorite/favorites`;

      await axios({
        method: "POST",
        url: endpoint,
        headers: getAuthHeader(),
        data: { hostelId },
      });

      // Update the favorites state
      setFavorites((prev) =>
        isFavorite ? prev.filter((id) => id !== hostelId) : [...prev, hostelId]
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10"></div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 relative z-10">
            Find Your
            <br />
            <span className="text-primaryColor">Perfect Hostel</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 relative z-10">
            Discover unique hostels for your next adventure
          </p>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where are you heading?"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <div className="relative">
                  <FaRegCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor text-white"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="bg-primaryColor text-white px-6 py-3 rounded-lg hover:bg-primaryColor-dark transition duration-300 transform hover:scale-105"
                onClick={handleSearch}
              >
                Search Hostels
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Available Hostels</h2>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-300"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
          </div>

          {filterOpen && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-3">Filters</h3>
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="p-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <button
                  onClick={applyFilters}
                  className="bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor-dark transition duration-300"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          <InfiniteScroll
            dataLength={hostels.length}
            next={fetchHostels}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {hostels.map((hostel) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                isFavorite={favorites.includes(hostel.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </InfiniteScroll>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const HostelCard = ({ hostel, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/hostel/${hostel.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(hostel.id);
  };

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={hostel.image}
          alt={hostel.name}
          className="w-full h-48 object-cover"
        />
        <button
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-50 rounded-full transition-all duration-300 hover:bg-opacity-100"
          onClick={handleFavoriteClick}
        >
          <FaHeart
            className={`w-5 h-5 ${
              isFavorite ? "text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{hostel.name}</h3>
        <p className="text-gray-400 text-sm mb-2 flex items-center">
          <FaMapMarkedAlt className="mr-1" />
          {hostel.location}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-primaryColor">
            Rs{hostel.price}
          </span>
          <span className="text-sm text-gray-400">per night</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(hostel.rating)
                    ? "text-yellow-500"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">{hostel.rating}</span>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-700">
        <button className="w-full bg-primaryColor text-white py-2 rounded-md hover:bg-primaryColor-dark transition duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default Hostels;
