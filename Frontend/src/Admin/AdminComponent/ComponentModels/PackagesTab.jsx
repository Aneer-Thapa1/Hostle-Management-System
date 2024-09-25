import React, { useState, useEffect } from "react";
import { useHostelApi } from "./useHostelApi";

const PackagesTab = ({ hostelData, setHostelData }) => {
  const { fetchPackages, addPackage, updatePackage, deletePackage } =
    useHostelApi();
  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    services: "",
    mealPlan: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const packages = await fetchPackages();
      setHostelData((prevData) => ({ ...prevData, packages }));
      setLoading(false);
    } catch (err) {
      console.error("Error loading packages:", err);
      setError("Failed to load packages. Please try again later.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updatePackage(packageForm.id, packageForm);
      } else {
        await addPackage(packageForm);
      }
      await loadPackages();
      handleCancel();
    } catch (err) {
      console.error("Error submitting package:", err);
      setError("Failed to submit package. Please try again.");
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      await deletePackage(id);
      await loadPackages();
    } catch (err) {
      console.error("Error deleting package:", err);
      setError("Failed to delete package. Please try again.");
    }
  };

  const openPopup = (pkg = null) => {
    if (pkg) {
      setPackageForm(pkg);
      setIsEditing(true);
    } else {
      setPackageForm({
        name: "",
        description: "",
        price: "",
        duration: "",
        services: "",
        mealPlan: "",
      });
      setIsEditing(false);
    }
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
    setPackageForm({
      name: "",
      description: "",
      price: "",
      duration: "",
      services: "",
      mealPlan: "",
    });
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="h-full flex flex-col bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Packages</h2>
        <button
          onClick={() => openPopup()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
        >
          Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hostelData.packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {pkg.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 flex-grow">
              {pkg.description}
            </p>
            <div className="text-sm mb-1">
              <span className="font-medium">Price:</span> ${pkg.price}
            </div>
            <div className="text-sm mb-1">
              <span className="font-medium">Duration:</span> {pkg.duration} days
            </div>
            <div className="text-sm mb-2">
              <span className="font-medium">Meal Plan:</span> {pkg.mealPlan}
            </div>
            <div className="mt-auto flex justify-end space-x-2">
              <button
                onClick={() => openPopup(pkg)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePackage(pkg.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {isEditing ? "Edit Package" : "Add New Package"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Package Name"
                name="name"
                value={packageForm.name}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, name: e.target.value })
                }
              />
              <InputField
                label="Price"
                name="price"
                type="number"
                value={packageForm.price}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, price: e.target.value })
                }
              />
              <InputField
                label="Description"
                name="description"
                value={packageForm.description}
                onChange={(e) =>
                  setPackageForm({
                    ...packageForm,
                    description: e.target.value,
                  })
                }
                textarea
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Duration (days)"
                  name="duration"
                  type="number"
                  value={packageForm.duration}
                  onChange={(e) =>
                    setPackageForm({ ...packageForm, duration: e.target.value })
                  }
                />
                <InputField
                  label="Meal Plan"
                  name="mealPlan"
                  value={packageForm.mealPlan}
                  onChange={(e) =>
                    setPackageForm({ ...packageForm, mealPlan: e.target.value })
                  }
                />
              </div>
              <InputField
                label="Services"
                name="services"
                value={packageForm.services}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, services: e.target.value })
                }
                textarea
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  {isEditing ? "Update" : "Add"} Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  textarea = false,
  ...props
}) => (
  <div>
    <label
      className="block text-sm font-medium text-gray-700 mb-1"
      htmlFor={name}
    >
      {label}
    </label>
    {textarea ? (
      <textarea
        className="w-full px-3 py-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows="3"
        {...props}
      />
    ) : (
      <input
        className="w-full px-3 py-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
    )}
  </div>
);

export default PackagesTab;
