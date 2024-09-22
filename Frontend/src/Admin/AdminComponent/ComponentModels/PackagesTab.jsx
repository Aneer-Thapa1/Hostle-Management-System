import React, { useState, useEffect } from "react";
import { useHostelApi } from "./useHostelApi";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const PackagesTab = ({ hostelData, setHostelData }) => {
  const { fetchPackages, addPackage, updatePackage, deletePackage } =
    useHostelApi();
  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const packages = await fetchPackages();
      setHostelData((prev) => ({ ...prev, packages: packages || [] }));
    } catch (error) {
      console.error("Error loading packages:", error);
      setError("Failed to load packages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updated = await updatePackage(packageForm.id, packageForm);
        setHostelData((prev) => ({
          ...prev,
          packages: prev.packages.map((pkg) =>
            pkg.id === packageForm.id ? updated : pkg
          ),
        }));
      } else {
        const addedPackage = await addPackage(packageForm);
        setHostelData((prev) => ({
          ...prev,
          packages: [...(prev.packages || []), addedPackage],
        }));
      }
      setShowPopup(false);
      setPackageForm({ name: "", description: "", price: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error handling package:", error);
      setError(
        `Failed to ${isEditing ? "update" : "add"} package. Please try again.`
      );
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackage(id);
        setHostelData((prev) => ({
          ...prev,
          packages: prev.packages.filter((pkg) => pkg.id !== id),
        }));
      } catch (error) {
        console.error("Error deleting package:", error);
        setError("Failed to delete package. Please try again.");
      }
    }
  };

  const openPopup = (pkg = null) => {
    if (pkg) {
      setPackageForm(pkg);
      setIsEditing(true);
    } else {
      setPackageForm({ name: "", description: "", price: "" });
      setIsEditing(false);
    }
    setShowPopup(true);
  };

  if (loading) return <div className="text-gray-700">Loading packages...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Packages</h2>
        <button
          onClick={() => openPopup()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
        >
          <FaPlus className="mr-2" /> Add Package
        </button>
      </div>

      <div className="overflow-y-auto flex-grow">
        {Array.isArray(hostelData?.packages) &&
        hostelData.packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostelData.packages.map((pkg) => (
              <div key={pkg.id} className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  {pkg.name}
                </h3>
                <p className="text-gray-600 mb-2">{pkg.description}</p>
                <p className="text-gray-800 mb-4">Price: ${pkg.price}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => openPopup(pkg)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No packages available.</p>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {isEditing ? "Edit Package" : "Add New Package"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-800"
                placeholder="Package Name"
                value={packageForm.name}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, name: e.target.value })
                }
                required
              />
              <textarea
                className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-800"
                placeholder="Package Description"
                value={packageForm.description}
                onChange={(e) =>
                  setPackageForm({
                    ...packageForm,
                    description: e.target.value,
                  })
                }
                required
                rows="3"
              />
              <input
                className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-800"
                type="number"
                placeholder="Price"
                value={packageForm.price}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, price: e.target.value })
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

export default PackagesTab;
