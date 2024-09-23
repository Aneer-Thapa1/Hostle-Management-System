import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { IoIosStarOutline, IoMdStar, IoMdClose } from "react-icons/io";
import {
  FaMapMarkerAlt,
  FaExpand,
  FaBed,
  FaUsers,
  FaMoneyBillWave,
  FaSpinner,
} from "react-icons/fa";
import HostelInformation from "../components/HostelInformation";
import PackageSummary from "../components/PackeageSummary";
import Facilities from "../components/Facilities";
import Gallery from "../components/Gallery";
import Meals from "../components/Meals";
import BookingModal from "../components/BookingModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchHostelData = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/hostel/hostel/${id}`, {
      headers: getAuthHeader(),
    });
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching hostel data:", error);
    throw error;
  }
};

const fetchNearbyHostels = async ({ queryKey }) => {
  const [_, latitude, longitude, mainHostelId] = queryKey;
  if (!latitude || !longitude) {
    throw new Error("Latitude and longitude are required");
  }
  try {
    const response = await axiosInstance.get(`/api/hostel/nearby`, {
      params: { latitude, longitude, limit: 3, mainHostelId },
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching nearby hostels:", error);
    throw error;
  }
};

const Hostel = () => {
  const [selectedOption, setSelectedOption] = useState("Hostel Information");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { id } = useParams();

  const {
    data: hostelData,
    isLoading,
    error,
  } = useQuery(["hostel", id], () => fetchHostelData(id), {
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error("Error fetching hostel data:", error);
    },
  });

  const {
    data: nearbyHostels,
    isLoading: isLoadingNearby,
    error: errorNearby,
  } = useQuery(
    ["nearbyHostels", hostelData?.latitude, hostelData?.longitude, id],
    fetchNearbyHostels,
    {
      enabled: !!hostelData?.latitude && !!hostelData?.longitude,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  const bookingMutation = useMutation(
    (bookingData) =>
      axiosInstance.post(`/api/booking/addBooking`, bookingData, {
        headers: getAuthHeader(),
      }),
    {
      onSuccess: () => {
        alert("Booking successful!");
        setIsBookingModalOpen(false);
      },
      onError: (error) => {
        alert(
          `Booking failed: ${error.response?.data?.message || error.message}`
        );
      },
    }
  );

  const handleBookingSubmit = (bookingInfo) => {
    bookingMutation.mutate({
      hostelId: id,
      ...bookingInfo,
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-primaryColor text-4xl" />
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center text-2xl mt-10">
        Error: {error.message}
      </div>
    );
  if (!hostelData)
    return (
      <div className="text-white text-center text-2xl mt-10">
        No hostel data available
      </div>
    );

  const renderComponent = () => {
    switch (selectedOption) {
      case "Hostel Information":
        return <HostelInformation hostelData={hostelData} />;
      case "Package Summary":
        return <PackageSummary hostelId={id} />;
      case "Facilities & Activities":
        return <Facilities hostelId={id} />;
      case "Gallery":
        return <Gallery hostelId={id} />;
      case "Meals":
        return <Meals hostelId={id} />;
      default:
        return <HostelInformation hostelData={hostelData} />;
    }
  };

  const MapModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-white w-11/12 h-5/6 rounded-lg p-4 relative">
        <button
          onClick={() => setIsMapModalOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <IoMdClose size={24} />
        </button>
        <MapContainer
          center={[hostelData.latitude, hostelData.longitude]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[hostelData.latitude, hostelData.longitude]}>
            <Popup>
              {hostelData.hostelName} <br /> {hostelData.address}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );

  const NearbyHostelCard = ({ hostel }) => (
    <div className="bg-boxColor rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      <img
        src={hostel.mainPhoto || "/path/to/default/image.jpg"}
        alt={hostel.hostelName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-white mb-2">
          {hostel.hostelName}
        </h3>
        <p className="text-gray-400 text-sm mb-2 flex items-center">
          <FaMapMarkerAlt className="mr-1" />
          {hostel.location}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-primaryColor font-bold">
            Rs {hostel.minPrice}
            <span className="text-xs text-gray-400">/month</span>
          </span>
          <Link
            to={`/hostel/${hostel.id}`}
            className="bg-primaryColor text-white px-3 py-1 rounded-md text-sm hover:bg-primaryColor-dark transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full flex flex-col items-center gap-10 mt-9 px-4">
        <div className="flex w-full max-w-6xl flex-col gap-6">
          <p className="text-gray-400 text-sm">
            hostels / {hostelData.hostelName.toLowerCase()}
          </p>
          <div className="flex gap-2 text-yellow-400 text-2xl">
            {[...Array(5)].map((_, index) =>
              index < Math.floor(hostelData.rating || 0) ? (
                <IoMdStar key={index} />
              ) : (
                <IoIosStarOutline key={index} />
              )
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-3xl text-white">
              {hostelData.hostelName}
            </h1>
            <p className="text-gray-400 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-primaryColor" />
              {hostelData.location}
            </p>
          </div>

          <div className="flex flex-col md:flex-row w-full justify-between gap-6">
            <div className="w-full md:w-8/12">
              <img
                src={hostelData.mainPhoto || "/path/to/default/image.jpg"}
                alt={hostelData.hostelName}
                className="w-full h-96 rounded-lg object-cover shadow-lg"
              />
            </div>
            <div className="w-full md:w-4/12 flex flex-col gap-6">
              <div className="bg-boxColor h-fit w-full flex flex-col gap-6 p-6 rounded-lg shadow-md">
                <div className="flex justify-between">
                  <div className="flex flex-col items-start gap-2 text-white">
                    <p className="text-gray-400">Price Starts At</p>
                    <p className="text-2xl font-bold text-primaryColor">
                      Rs {hostelData.minPrice}
                      <span className="text-sm text-gray-400 ml-1">
                        per month
                      </span>
                    </p>
                    <p className="text-sm">Quick Booking</p>
                  </div>
                  <div className="text-white flex flex-col items-end gap-2">
                    <p className="flex items-center">
                      <FaBed className="mr-2 text-primaryColor" />
                      {hostelData.roomCount} Rooms
                    </p>
                    <p className="flex items-center">
                      <FaUsers className="mr-2 text-primaryColor" />
                      {hostelData.userCount} Students
                    </p>
                    <p className="flex items-center">
                      <FaMoneyBillWave className="mr-2 text-primaryColor" />
                      {hostelData.packages && hostelData.packages.length > 0
                        ? "Packages Available"
                        : "No Packages"}
                    </p>
                  </div>
                </div>
                <button
                  className="bg-primaryColor rounded-lg py-3 text-white font-medium hover:bg-primaryColor-dark transition-colors duration-200"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  Send Booking Request
                </button>
              </div>

              <div className="w-full h-64 rounded-lg overflow-hidden z-0 relative shadow-lg">
                <MapContainer
                  center={[hostelData.latitude, hostelData.longitude]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[hostelData.latitude, hostelData.longitude]}
                  >
                    <Popup>
                      {hostelData.hostelName} <br /> {hostelData.address}
                    </Popup>
                  </Marker>
                </MapContainer>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <FaExpand className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            {hostelData.description}
          </p>
        </div>

        <div className="flex w-full max-w-6xl flex-col gap-8">
          <div className="flex flex-wrap gap-6 text-white">
            {[
              "Hostel Information",
              "Package Summary",
              "Facilities & Activities",
              "Gallery",
              "Meals",
            ].map((option) => (
              <button
                key={option}
                className={`pb-2 transition-colors duration-200 ${
                  selectedOption === option
                    ? "border-b-2 border-primaryColor text-primaryColor"
                    : "hover:text-primaryColor"
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="bg-boxColor p-6 rounded-lg shadow-lg">
            {renderComponent()}
          </div>
        </div>

        {/* Nearby Hostels Section */}
        <div className="w-full max-w-6xl mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Nearby Hostels</h2>
          {isLoadingNearby ? (
            <p className="text-white">Loading nearby hostels...</p>
          ) : errorNearby ? (
            <p className="text-red-500">
              Error loading nearby hostels: {errorNearby.message}
            </p>
          ) : nearbyHostels && nearbyHostels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nearbyHostels.map((hostel) => (
                <NearbyHostelCard key={hostel.id} hostel={hostel} />
              ))}
            </div>
          ) : (
            <p className="text-white">No nearby hostels found.</p>
          )}
        </div>
      </main>

      <Footer />
      {isMapModalOpen && <MapModal />}
      {isBookingModalOpen && (
        <BookingModal
          hostelId={id}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default Hostel;
