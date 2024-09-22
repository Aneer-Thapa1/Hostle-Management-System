import React, { useState, useEffect } from "react";
import { useHostelApi } from "./useHostelApi";

const FacilitiesTab = ({ hostelData, setHostelData }) => {
  const { fetchFacilities, addFacility, deleteFacility } = useHostelApi();
  const [newFacility, setNewFacility] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const facilities = await fetchFacilities();
      setHostelData((prev) => ({ ...prev, facilities: facilities || [] }));
    } catch (error) {
      console.error("Error loading facilities:", error);
      setError("Failed to load facilities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = async () => {
    if (!newFacility.trim()) return;
    try {
      const addedFacility = await addFacility({ name: newFacility });
      setHostelData((prev) => ({
        ...prev,
        facilities: [...(prev.facilities || []), addedFacility],
      }));
      setNewFacility("");
    } catch (error) {
      console.error("Error adding facility:", error);
      setError("Failed to add facility. Please try again.");
    }
  };

  const handleDeleteFacility = async (id) => {
    try {
      await deleteFacility(id);
      setHostelData((prev) => ({
        ...prev,
        facilities: prev.facilities.filter((facility) => facility.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting facility:", error);
      setError("Failed to delete facility. Please try again.");
    }
  };

  if (loading) return <div>Loading facilities...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Facilities</h2>
      {Array.isArray(hostelData?.facilities) &&
      hostelData.facilities.length > 0 ? (
        <ul className="mb-4">
          {hostelData.facilities.map((facility) => (
            <li
              key={facility.id}
              className="flex justify-between items-center mb-2"
            >
              <span>{facility.name}</span>
              <button
                onClick={() => handleDeleteFacility(facility.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No facilities available.</p>
      )}
      <div className="flex">
        <input
          className="flex-grow p-2 border rounded-l"
          type="text"
          placeholder="New Facility"
          value={newFacility}
          onChange={(e) => setNewFacility(e.target.value)}
        />
        <button
          onClick={handleAddFacility}
          className="bg-green-500 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default FacilitiesTab;
