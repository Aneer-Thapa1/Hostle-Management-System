import React, { useState, useEffect } from "react";
import { useHostelApi } from "./useHostelApi";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const MealsTab = ({ hostelData, setHostelData }) => {
  const { fetchMeals, addMeal, updateMeal, deleteMeal } = useHostelApi();
  const [mealForm, setMealForm] = useState({
    name: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    setLoading(true);
    try {
      const meals = await fetchMeals();
      setHostelData((prev) => ({ ...prev, meals: meals || [] }));
    } catch (error) {
      console.error("Error loading meals:", error);
      setError("Failed to load meals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updated = await updateMeal(mealForm.id, mealForm);
        setHostelData((prev) => ({
          ...prev,
          meals: prev.meals.map((meal) =>
            meal.id === mealForm.id ? updated : meal
          ),
        }));
      } else {
        const addedMeal = await addMeal(mealForm);
        setHostelData((prev) => ({
          ...prev,
          meals: [...(prev.meals || []), addedMeal],
        }));
      }
      setShowPopup(false);
      setMealForm({ name: "", description: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error handling meal:", error);
      setError(
        `Failed to ${isEditing ? "update" : "add"} meal. Please try again.`
      );
    }
  };

  const handleDeleteMeal = async (id) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await deleteMeal(id);
        setHostelData((prev) => ({
          ...prev,
          meals: prev.meals.filter((meal) => meal.id !== id),
        }));
      } catch (error) {
        console.error("Error deleting meal:", error);
        setError("Failed to delete meal. Please try again.");
      }
    }
  };

  const openPopup = (meal = null) => {
    if (meal) {
      setMealForm(meal);
      setIsEditing(true);
    } else {
      setMealForm({ name: "", description: "" });
      setIsEditing(false);
    }
    setShowPopup(true);
  };

  if (loading) return <div className="text-gray-700">Loading meals...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white  rounded-lg  h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Meals</h2>
        <button
          onClick={() => openPopup()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
        >
          <FaPlus className="mr-2" /> Add Meal
        </button>
      </div>

      <div className="overflow-y-auto flex-grow">
        {Array.isArray(hostelData?.meals) && hostelData.meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostelData.meals.map((meal) => (
              <div key={meal.id} className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  {meal.name}
                </h3>
                <p className="text-gray-600 mb-4">{meal.description}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => openPopup(meal)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No meals available.</p>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {isEditing ? "Edit Meal" : "Add New Meal"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-800"
                placeholder="Meal Name"
                value={mealForm.name}
                onChange={(e) =>
                  setMealForm({ ...mealForm, name: e.target.value })
                }
                required
              />
              <textarea
                className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-800"
                placeholder="Meal Description"
                value={mealForm.description}
                onChange={(e) =>
                  setMealForm({ ...mealForm, description: e.target.value })
                }
                required
                rows="3"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsTab;
