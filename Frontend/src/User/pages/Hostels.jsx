import React, { useState, useEffect, useCallback, useRef } from "react";
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
  FaSortAmountDown,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const baseURL = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

// Custom marker icons
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to fit map bounds
function FitBoundsToMarkers({ markers, userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map((marker) => [marker.latitude, marker.longitude])
      );
      if (userLocation) {
        bounds.extend(userLocation);
      }
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, userLocation]);

  return null;
}

const Hostels = () => {
  const [allHostels, setAllHostels] = useState([]);
  const [displayedHostels, setDisplayedHostels] = useState([]);
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
  const [sortCriteria, setSortCriteria] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAllHostels = useCallback(async () => {
    try {
      const response = await axios.get(`${baseURL}/api/hostel/all-hostels`, {
        headers: getAuthHeader(),
      });
      setAllHostels(response.data.hostels);
    } catch (error) {
      console.error("Error fetching all hostels:", error);
    }
  }, []);

  const searchAlgorithm = (hostels, query) => {
    const lowercaseQuery = query.toLowerCase();
    return hostels.filter(
      (hostel) =>
        hostel.name.toLowerCase().includes(lowercaseQuery) ||
        hostel.location.toLowerCase().includes(lowercaseQuery)
    );
  };

  const sortAlgorithm = (hostels, criteria, order) => {
    return [...hostels].sort((a, b) => {
      if (criteria === "price") {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      } else if (criteria === "rating") {
        return order === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });
  };

  const fetchDisplayedHostels = useCallback(
    async (reset = false) => {
      try {
        let filteredHostels = allHostels;

        // Apply search
        if (searchQuery) {
          filteredHostels = searchAlgorithm(filteredHostels, searchQuery);
        }

        // Apply filters
        if (filters.location) {
          filteredHostels = filteredHostels.filter((hostel) =>
            hostel.location
              .toLowerCase()
              .includes(filters.location.toLowerCase())
          );
        }
        if (filters.maxPrice) {
          filteredHostels = filteredHostels.filter(
            (hostel) => hostel.price <= parseFloat(filters.maxPrice)
          );
        }

        // Apply sorting
        filteredHostels = sortAlgorithm(
          filteredHostels,
          sortCriteria,
          sortOrder
        );

        // Pagination
        const startIndex = reset ? 0 : (page - 1) * 9;
        const endIndex = startIndex + 9;
        const paginatedHostels = filteredHostels.slice(startIndex, endIndex);

        setDisplayedHostels((prev) =>
          reset ? paginatedHostels : [...prev, ...paginatedHostels]
        );
        setHasMore(endIndex < filteredHostels.length);
        setPage((prev) => (reset ? 2 : prev + 1));
      } catch (error) {
        console.error("Error fetching displayed hostels:", error);
      }
    },
    [allHostels, page, searchQuery, filters, sortCriteria, sortOrder]
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
    fetchAllHostels();
    fetchDisplayedHostels(true);
    fetchFavorites();

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  useEffect(() => {
    fetchDisplayedHostels(true);
  }, [searchQuery, filters, sortCriteria, sortOrder]);

  const handleSearch = () => {
    fetchDisplayedHostels(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchDisplayedHostels(true);
    setFilterOpen(false);
  };

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    fetchDisplayedHostels(true);
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
        {/* Map Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Hostel Locations</h2>
          <div style={{ height: "400px", width: "100%" }}>
            <MapContainer
              center={[0, 0]}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {allHostels.map((hostel) =>
                hostel.latitude && hostel.longitude ? (
                  <Marker
                    key={hostel.id}
                    position={[hostel.latitude, hostel.longitude]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div>
                        <h3>{hostel.name}</h3>
                        <p>{hostel.location}</p>
                        <p>Price: Rs{hostel.price}</p>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>You are here</Popup>
                </Marker>
              )}
              <FitBoundsToMarkers
                markers={allHostels}
                userLocation={userLocation}
              />
            </MapContainer>
          </div>
        </section>

        {/* Search Section */}
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

              <button
                className="bg-primaryColor text-white px-6 py-3 rounded-lg hover:bg-primaryColor-dark transition duration-300 transform hover:scale-105"
                onClick={handleSearch}
              >
                Search Hostels
              </button>
            </div>
          </div>
        </section>

        {/* Hostels List Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Available Hostels</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleSort("price")}
                className="flex items-center justify-center p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-300"
              >
                <FaSortAmountDown className="mr-2" />
                Sort by Price
              </button>
              <button
                onClick={() => handleSort("rating")}
                className="flex items-center justify-center p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-300"
              >
                <FaSortAmountDown className="mr-2" />
                Sort by Rating
              </button>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center justify-center p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-300"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
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
            dataLength={displayedHostels.length}
            next={fetchDisplayedHostels}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayedHostels.map((hostel) => (
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
