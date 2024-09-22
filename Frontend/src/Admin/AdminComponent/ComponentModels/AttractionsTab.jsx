import React, { useState, useEffect } from "react";
import { useHostelApi } from "./useHostelApi";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const AttractionsTab = ({ hostelData, setHostelData }) => {
  const {
    fetchAttractions,
    addAttraction,
    updateAttraction,
    deleteAttraction,
  } = useHostelApi();
  const [attractionForm, setAttractionForm] = useState({
    name: "",
    distance: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAttractions();
  }, []);

  const loadAttractions = async () => {
    setLoading(true);
    try {
      const attractions = await fetchAttractions();
      setHostelData((prev) => ({
        ...prev,
        nearbyAttractions: attractions || [],
      }));
    } catch (error) {
      console.error("Error loading attractions:", error);
      setError("Failed to load attractions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updated = await updateAttraction(
          attractionForm.id,
          attractionForm
        );
        setHostelData((prev) => ({
          ...prev,
          nearbyAttractions: prev.nearbyAttractions.map((attr) =>
            attr.id === attractionForm.id ? updated : attr
          ),
        }));
      } else {
        const addedAttraction = await addAttraction(attractionForm);
        setHostelData((prev) => ({
          ...prev,
          nearbyAttractions: [
            ...(prev.nearbyAttractions || []),
            addedAttraction,
          ],
        }));
      }
      setShowPopup(false);
      setAttractionForm({ name: "", distance: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error handling attraction:", error);
      setError(
        `Failed to ${
          isEditing ? "update" : "add"
        } attraction. Please try again.`
      );
    }
  };

  const handleDeleteAttraction = async (id) => {
    if (window.confirm("Are you sure you want to delete this attraction?")) {
      try {
        await deleteAttraction(id);
        setHostelData((prev) => ({
          ...prev,
          nearbyAttractions: prev.nearbyAttractions.filter(
            (attr) => attr.id !== id
          ),
        }));
      } catch (error) {
        console.error("Error deleting attraction:", error);
        setError("Failed to delete attraction. Please try again.");
      }
    }
  };

  const openPopup = (attraction = null) => {
    if (attraction) {
      setAttractionForm(attraction);
      setIsEditing(true);
    } else {
      setAttractionForm({ name: "", distance: "" });
      setIsEditing(false);
    }
    setShowPopup(true);
  };

  if (loading)
    return <div className="text-gray-700">Loading attractions...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg  h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Nearby Attractions</h2>
        <button
          onClick={() => openPopup()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
        >
          <FaPlus className="mr-2" /> Add Attraction
        </button>
      </div>

      <div className="overflow-y-auto flex-grow">
        {Array.isArray(hostelData?.nearbyAttractions) &&
        hostelData.nearbyAttractions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostelData.nearbyAttractions.map((attraction) => (
              <div
                key={attraction.id}
                className="bg-gray-100 p-4 rounded-lg shadow"
              >
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  {attraction.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  Distance: {attraction.distance}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => openPopup(attraction)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteAttraction(attraction.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No nearby attractions available.</p>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {isEditing ? "Edit Attraction" : "Add New Attraction"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-800"
                placeholder="Attraction Name"
                value={attractionForm.name}
                onChange={(e) =>
                  setAttractionForm({ ...attractionForm, name: e.target.value })
                }
                required
              />
              <input
                className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-800"
                placeholder="Distance"
                value={attractionForm.distance}
                onChange={(e) =>
                  setAttractionForm({
                    ...attractionForm,
                    distance: e.target.value,
                  })
                }
                required
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

export default AttractionsTab;
