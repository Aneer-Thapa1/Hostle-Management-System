import React, { useState, useEffect } from "react";
import { useHostelApi } from "./useHostelApi";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBed,
  FaUtensils,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaConciergeBell,
  FaRegWindowClose,
} from "react-icons/fa";

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
    cancellationPolicy: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    // ... (loading logic remains the same)
  };

  const handleSubmit = async (e) => {
    // ... (submit logic remains the same)
  };

  const handleDeletePackage = async (id) => {
    // ... (delete logic remains the same)
  };

  const openPopup = (pkg = null) => {
    // ... (openPopup logic remains the same)
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition duration-300 ease-in-out"
        >
          <FaPlus className="mr-2" /> Add Package
        </button>
      </div>

      {/* Package list rendering remains the same */}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
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
                icon={<FaBed />}
              />
              <InputField
                label="Price"
                name="price"
                type="number"
                value={packageForm.price}
                onChange={(e) =>
                  setPackageForm({ ...packageForm, price: e.target.value })
                }
                icon={<FaMoneyBillWave />}
                prefix="$"
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
                  icon={<FaCalendarAlt />}
                />
                <InputField
                  label="Meal Plan"
                  name="mealPlan"
                  value={packageForm.mealPlan}
                  onChange={(e) =>
                    setPackageForm({ ...packageForm, mealPlan: e.target.value })
                  }
                  icon={<FaUtensils />}
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
                icon={<FaConciergeBell />}
              />
              <InputField
                label="Cancellation Policy"
                name="cancellationPolicy"
                value={packageForm.cancellationPolicy}
                onChange={(e) =>
                  setPackageForm({
                    ...packageForm,
                    cancellationPolicy: e.target.value,
                  })
                }
                textarea
                icon={<FaRegWindowClose />}
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
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
  icon,
  prefix,
  ...props
}) => (
  <div className="relative">
    <label
      className="block text-sm font-medium text-gray-700 mb-1"
      htmlFor={name}
    >
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(icon, { className: "text-gray-400 w-4 h-4" })}
        </div>
      )}
      {textarea ? (
        <textarea
          className="w-full py-2 px-3 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows="3"
          {...props}
        />
      ) : (
        <input
          className={`w-full py-2 px-3 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 ${
            icon || prefix ? "pl-10" : ""
          }`}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          {...props}
        />
      )}
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500">{prefix}</span>
        </div>
      )}
    </div>
  </div>
);

export default PackagesTab;
