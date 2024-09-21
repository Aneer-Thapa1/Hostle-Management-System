import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSave,
  FaPlus,
  FaTrash,
  FaImage,
  FaBed,
  FaUtensils,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import { MdAttractions } from "react-icons/md";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

// Create an axios instance with default headers
const api = axios.create({
  baseURL: apiUrl,
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Inline components (InputField, TextAreaField, ImageUpload) remain the same...

const AdminUserView = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [hostelData, setHostelData] = useState({
    name: "",
    description: "",
    location: "",
    packages: [],
    facilities: [],
    gallery: [],
    meals: [],
    nearbyAttractions: [],
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    fetchHostelData();
  }, []);

  const fetchHostelData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/content/info");
      setHostelData((prev) => ({
        ...prev,
        ...response.data,
        packages: response.data.packages || [],
        facilities: response.data.facilities || [],
        gallery: response.data.gallery || [],
        meals: response.data.meals || [],
        nearbyAttractions: response.data.nearbyAttractions || [],
      }));
    } catch (err) {
      setError("Failed to fetch hostel data. Please try again.");
      console.error("Error fetching hostel data:", err);
    }
    setIsLoading(false);
  };

  const handleInputChange = (section, value) => {
    setHostelData((prev) => ({ ...prev, [section]: value }));
  };

  const handleArrayItemChange = (section, id, field, value) => {
    setHostelData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddItem = async (section) => {
    try {
      const response = await api.post(`/api/content/${section}`, newItem);
      setHostelData((prev) => ({
        ...prev,
        [section]: [...(prev[section] || []), response.data],
      }));
      setIsAddingNew(false);
      setNewItem({});
    } catch (err) {
      setError(`Failed to add ${section.slice(0, -1)}. Please try again.`);
      console.error(`Error adding ${section.slice(0, -1)}:`, err);
    }
  };

  const handleRemoveItem = async (section, id) => {
    try {
      await api.delete(`/api/content/${section}/${id}`);
      setHostelData((prev) => ({
        ...prev,
        [section]: (prev[section] || []).filter((item) => item.id !== id),
      }));
      setEditingItem(null);
    } catch (err) {
      setError(`Failed to delete ${section.slice(0, -1)}. Please try again.`);
      console.error(`Error deleting ${section.slice(0, -1)}:`, err);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await api.post("/api/content/gallery", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setHostelData((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), response.data],
        }));
      } catch (err) {
        setError("Failed to upload image. Please try again.");
        console.error("Error uploading image:", err);
      }
    }
  };

  const getEmptyItem = (section) => {
    switch (section) {
      case "packages":
        return { name: "", description: "", price: "" };
      case "facilities":
        return { name: "" };
      case "meals":
        return { name: "", description: "" };
      case "nearbyAttractions":
        return { name: "", distance: "" };
      default:
        return {};
    }
  };

  const saveChanges = async () => {
    try {
      await api.put("/api/content/info", {
        name: hostelData.name,
        description: hostelData.description,
        location: hostelData.location,
      });
      setError(null);
      alert("Changes saved successfully!");
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Error saving changes:", err);
    }
  };

  const renderInfoTab = () => (
    <div>
      <InputField
        label="Hostel Name"
        value={hostelData.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
        placeholder="Enter hostel name"
      />
      <TextAreaField
        label="Description"
        value={hostelData.description || ""}
        onChange={(e) => handleInputChange("description", e.target.value)}
        placeholder="Enter hostel description"
      />
      <InputField
        label="Location"
        value={hostelData.location || ""}
        onChange={(e) => handleInputChange("location", e.target.value)}
        placeholder="Enter hostel location"
      />
    </div>
  );

  const renderListItem = (item, section, fields) => (
    <div
      key={item.id}
      className="mb-2 p-3 bg-gray-50 rounded-lg flex justify-between items-center"
    >
      <div>
        {fields.map((field) => (
          <p key={field.name} className="text-sm">
            <span className="font-medium">{field.label}:</span>{" "}
            {item[field.name]}
          </p>
        ))}
      </div>
      <div>
        <button
          onClick={() => setEditingItem(item)}
          className="text-blue-600 hover:text-blue-800 mr-2"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => handleRemoveItem(section, item.id)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );

  const renderEditForm = (item, section, fields) => (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      {fields.map((field) => (
        <InputField
          key={field.name}
          label={field.label}
          value={item[field.name] || ""}
          onChange={(e) =>
            handleArrayItemChange(section, item.id, field.name, e.target.value)
          }
          type={field.type || "text"}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      ))}
      <button
        onClick={() => setEditingItem(null)}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
      >
        Save Changes
      </button>
    </div>
  );

  const renderAddForm = (section, fields) => (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      {fields.map((field) => (
        <InputField
          key={field.name}
          label={field.label}
          value={newItem[field.name] || ""}
          onChange={(e) =>
            setNewItem({ ...newItem, [field.name]: e.target.value })
          }
          type={field.type || "text"}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      ))}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsAddingNew(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 mr-2"
        >
          Cancel
        </button>
        <button
          onClick={() => handleAddItem(section)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Add
        </button>
      </div>
    </div>
  );

  const renderDynamicSection = (section, fields) => (
    <div>
      {(hostelData[section] || []).map((item) =>
        editingItem && editingItem.id === item.id
          ? renderEditForm(item, section, fields)
          : renderListItem(item, section, fields)
      )}
      {isAddingNew ? (
        renderAddForm(section, fields)
      ) : (
        <button
          onClick={() => {
            setIsAddingNew(true);
            setNewItem(getEmptyItem(section));
          }}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New {section.slice(0, -1)}
        </button>
      )}
    </div>
  );

  const renderGalleryTab = () => (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {(hostelData.gallery || []).map((item) => (
          <div key={item.id} className="relative">
            <img
              src={item.imageUrl}
              alt="Gallery"
              className="w-full h-32 object-cover rounded-md"
            />
            <button
              onClick={() => handleRemoveItem("gallery", item.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
      <ImageUpload onImageUpload={handleImageUpload} />
    </div>
  );

  const tabContent = {
    info: renderInfoTab(),
    packages: renderDynamicSection("packages", [
      { name: "name", label: "Package Name" },
      { name: "description", label: "Description" },
      { name: "price", label: "Price", type: "number" },
    ]),
    facilities: renderDynamicSection("facilities", [
      { name: "name", label: "Facility Name" },
    ]),
    gallery: renderGalleryTab(),
    meals: renderDynamicSection("meals", [
      { name: "name", label: "Meal Name" },
      { name: "description", label: "Description" },
    ]),
    attractions: renderDynamicSection("nearbyAttractions", [
      { name: "name", label: "Attraction Name" },
      { name: "distance", label: "Distance" },
    ]),
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full h-full bg-gray-100 p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Hostel Page Content
      </h1>
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {Object.keys(tabContent).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center px-4 py-2 ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } rounded-t-lg transition-colors duration-200`}
          >
            <FaImage className="w-5 h-5 mr-2" />
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>
      <div className="flex-grow bg-white rounded-lg shadow-md p-6 overflow-auto">
        {tabContent[activeTab]}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveChanges}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
        >
          <FaSave className="mr-2" /> Save All Changes
        </button>
      </div>
    </div>
  );
};

export default AdminUserView;
