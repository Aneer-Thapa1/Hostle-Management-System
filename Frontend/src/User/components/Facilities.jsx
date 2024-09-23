import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  FaWifi,
  FaUtensils,
  FaTshirt,
  FaLock,
  FaGamepad,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
// import ContentHeader from "./ContentHeader";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchFacilities = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(`${apiUrl}/api/content/facilities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const Facilities = () => {
  const {
    data: facilities,
    isLoading,
    error,
  } = useQuery("facilities", fetchFacilities, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const getIconForFacility = (facilityName) => {
    const iconMap = {
      "Wi-Fi": FaWifi,
      Kitchen: FaUtensils,
      Laundry: FaTshirt,
      Security: FaLock,
      Entertainment: FaGamepad,
    };

    for (const [key, value] of Object.entries(iconMap)) {
      if (facilityName.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return FaGamepad; // Default icon
  };

  const FacilityItem = ({ item }) => {
    const Icon = getIconForFacility(item.name);
    return (
      <div className="flex items-center space-x-2 text-gray-300">
        <Icon className="text-primaryColor" />
        <span>{item.name}</span>
      </div>
    );
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
        <span>Error loading facilities: {error.message}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-boxColor rounded-b-lg p-6">
        {facilities && facilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((facility) => (
              <FacilityItem key={facility.id} item={facility} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            No facilities information available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Facilities;
