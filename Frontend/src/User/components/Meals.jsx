import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  FaUtensils,
  FaSpinner,
  FaExclamationCircle,
  FaLeaf,
  FaBreadSlice,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchMeals = async (hostelId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(`${apiUrl}/api/content/meals`, {
    params: { id: hostelId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const Meals = ({ hostelId }) => {
  const {
    data: meals,
    isLoading,
    error,
  } = useQuery(["meals", hostelId], () => fetchMeals(hostelId), {
    enabled: !!hostelId,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const MealItem = ({ meal }) => (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
        <FaUtensils className="mr-2 text-primaryColor" />
        {meal.name}
      </h3>
      <p className="text-gray-300 mb-2">{meal.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-primaryColor font-bold">Rs {meal.price}</span>
        <div className="flex items-center">
          {meal.isVegan && (
            <span className="flex items-center mr-2 text-green-400">
              <FaLeaf className="mr-1" /> Vegan
            </span>
          )}
          {meal.isGlutenFree && (
            <span className="flex items-center mr-2 text-yellow-400">
              <FaBreadSlice className="mr-1" /> Gluten-Free
            </span>
          )}
          {meal.available ? (
            <span className="flex items-center text-green-400">
              <FaCheckCircle className="mr-1" /> Available
            </span>
          ) : (
            <span className="flex items-center text-red-400">
              <FaTimesCircle className="mr-1" /> Not Available
            </span>
          )}
        </div>
      </div>
    </div>
  );

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
        <span>Error loading meals: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="bg-boxColor rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaUtensils className="mr-2 text-primaryColor" />
        Meals
      </h2>
      {meals && meals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealItem key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8 flex flex-col items-center">
          <FaExclamationCircle className="text-4xl mb-2" />
          <p>No meal information available at the moment.</p>
          <p className="mt-2 text-sm">
            This could be because no meals have been added yet, or there might
            be an issue with the data retrieval.
          </p>
        </div>
      )}
    </div>
  );
};

export default Meals;
