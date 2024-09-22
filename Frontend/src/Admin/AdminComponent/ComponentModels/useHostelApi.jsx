import { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";
const baseURL = `${apiUrl}/api/content`;

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export const useHostelApi = () => {
  const [error, setError] = useState(null);

  const handleRequest = async (method, url, data = null) => {
    try {
      const response = await axiosInstance({
        method,
        url: url,
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    }
  };

  const fetchHostelInfo = () => handleRequest("get", "/info");
  const updateHostelInfo = (data) => handleRequest("put", "/info", data);

  const fetchPackages = () => handleRequest("get", "/packages");
  const addPackage = (data) => handleRequest("post", "/packages", data);
  const updatePackage = (id, data) =>
    handleRequest("put", `/packages/${id}`, data);
  const deletePackage = (id) => handleRequest("delete", `/packages/${id}`);

  const fetchFacilities = () => handleRequest("get", "/facilities");
  const addFacility = (data) => handleRequest("post", "/facilities", data);
  const deleteFacility = (id) => handleRequest("delete", `/facilities/${id}`);

  const fetchGallery = () => handleRequest("get", "/gallery");
  const addGalleryImage = (data) => handleRequest("post", "/gallery", data);
  const deleteGalleryImage = (id) => handleRequest("delete", `/gallery/${id}`);

  const fetchMeals = () => handleRequest("get", "/meals");
  const addMeal = (data) => handleRequest("post", "/meals", data);
  const updateMeal = (id, data) => handleRequest("put", `/meals/${id}`, data);
  const deleteMeal = (id) => handleRequest("delete", `/meals/${id}`);

  const fetchAttractions = () => handleRequest("get", "/attractions");
  const addAttraction = (data) => {
    console.log("Adding attraction:", data);
    return handleRequest("post", "/attractions", data);
  };
  const updateAttraction = (id, data) =>
    handleRequest("put", `/attractions/${id}`, data);
  const deleteAttraction = (id) =>
    handleRequest("delete", `/attractions/${id}`);

  return {
    error,
    fetchHostelInfo,
    updateHostelInfo,
    fetchPackages,
    addPackage,
    updatePackage,
    deletePackage,
    fetchFacilities,
    addFacility,
    deleteFacility,
    fetchGallery,
    addGalleryImage,
    deleteGalleryImage,
    fetchMeals,
    addMeal,
    updateMeal,
    deleteMeal,
    fetchAttractions,
    addAttraction,
    updateAttraction,
    deleteAttraction,
  };
};
