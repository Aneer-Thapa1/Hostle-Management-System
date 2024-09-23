import React, { useState, useEffect } from "react";
import { useHostelApi } from "./useHostelApi";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
} from "react-icons/fa";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

const FacilitiesTab = ({ hostelData, setHostelData }) => {
  const { fetchFacilities, addFacility, updateFacility, deleteFacility } =
    useHostelApi();
  const [facilityForm, setFacilityForm] = useState({
    name: "",
    description: "",
    available: true,
    operatingHours: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedFacility = await updateFacility(editingId, facilityForm);
        setHostelData((prev) => ({
          ...prev,
          facilities: prev.facilities.map((f) =>
            f.id === editingId ? updatedFacility : f
          ),
        }));
        setEditingId(null);
      } else {
        const addedFacility = await addFacility(facilityForm);
        setHostelData((prev) => ({
          ...prev,
          facilities: [...(prev.facilities || []), addedFacility],
        }));
      }
      setFacilityForm({
        name: "",
        description: "",
        available: true,
        operatingHours: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error handling facility:", error);
      setError(
        `Failed to ${editingId ? "update" : "add"} facility. Please try again.`
      );
    }
  };

  const handleEdit = (facility) => {
    setFacilityForm(facility);
    setEditingId(facility.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
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
    }
  };

  const openModal = () => {
    setFacilityForm({
      name: "",
      description: "",
      available: true,
      operatingHours: "",
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br  p-8 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-800">Facilities</h2>
        <button
          onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FaPlus className="mr-2" /> Add Facility
        </button>
      </div>
      <div className="flex-grow overflow-auto mb-6">
        {Array.isArray(hostelData?.facilities) &&
        hostelData.facilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostelData.facilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                <div className="bg-indigo-100 p-4">
                  <h3 className="font-bold text-xl text-indigo-800">
                    {facility.name}
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">{facility.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaClock className="mr-2 text-indigo-500" />
                    <span>
                      {facility.operatingHours ||
                        "No operating hours specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {facility.available ? (
                      <FaCheckCircle className="text-green-500 mr-2" />
                    ) : (
                      <FaTimesCircle className="text-red-500 mr-2" />
                    )}
                    <span
                      className={
                        facility.available ? "text-green-500" : "text-red-500"
                      }
                    >
                      {facility.available ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(facility)}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                    aria-label="Edit facility"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(facility.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    aria-label="Delete facility"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
            <FaBuilding className="text-indigo-300 text-6xl mb-4" />
            <p className="text-gray-500 text-xl mb-4">
              No facilities available.
            </p>
            <button
              onClick={openModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Your First Facility
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-3xl font-bold mb-6 text-indigo-800">
          {editingId ? "Edit Facility" : "Add New Facility"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Facility Name
            </label>
            <input
              type="text"
              id="name"
              value={facilityForm.name}
              onChange={(e) =>
                setFacilityForm({ ...facilityForm, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              required
              placeholder="Enter facility name"
            />
          </div>
          <div>
            <label
              htmlFor="operatingHours"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Operating Hours
            </label>
            <input
              type="text"
              id="operatingHours"
              value={facilityForm.operatingHours}
              onChange={(e) =>
                setFacilityForm({
                  ...facilityForm,
                  operatingHours: e.target.value,
                })
              }
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              placeholder="e.g., 9 AM - 5 PM"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={facilityForm.description}
              onChange={(e) =>
                setFacilityForm({
                  ...facilityForm,
                  description: e.target.value,
                })
              }
              rows="3"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              required
              placeholder="Describe the facility"
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              checked={facilityForm.available}
              onChange={(e) =>
                setFacilityForm({
                  ...facilityForm,
                  available: e.target.checked,
                })
              }
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition duration-200"
            />
            <label
              htmlFor="available"
              className="ml-2 block text-sm text-gray-900"
            >
              Available
            </label>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out"
            >
              {editingId ? "Update" : "Add"} Facility
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacilitiesTab;
