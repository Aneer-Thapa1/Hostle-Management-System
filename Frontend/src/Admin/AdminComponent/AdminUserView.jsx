import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaPlus,
  FaTrash,
  FaImage,
  FaBed,
  FaUtensils,
  FaEdit,
} from "react-icons/fa";
import { MdAttractions } from "react-icons/md";

const Tab = ({ icon, label, active, onClick }) => (
  <button
    className={`flex items-center px-4 py-2 ${
      active
        ? "bg-blue-500 text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    } rounded-t-lg transition-colors duration-200`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
  rows = 3,
  placeholder = "",
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    ></textarea>
  </div>
);

const ImageUpload = ({ onImageUpload }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Upload Image
    </label>
    <input
      type="file"
      onChange={onImageUpload}
      accept="image/*"
      className="w-full"
    />
  </div>
);

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

  useEffect(() => {
    // Simulated data fetch
    const data = {
      name: "Sample Hostel",
      description: "A cozy hostel in the heart of the city.",
      location: "123 Main St, Cityville",
      packages: [
        {
          id: 1,
          name: "Weekend Getaway",
          description: "Perfect for a short trip",
          price: 100,
        },
        {
          id: 2,
          name: "Extended Stay",
          description: "For those who want to explore more",
          price: 250,
        },
      ],
      facilities: [
        { id: 1, name: "Free Wi-Fi" },
        { id: 2, name: "Communal Kitchen" },
      ],
      gallery: [
        { id: 1, imageUrl: "https://example.com/image1.jpg" },
        { id: 2, imageUrl: "https://example.com/image2.jpg" },
      ],
      meals: [
        {
          id: 1,
          name: "Continental Breakfast",
          description: "Served daily from 7-10 AM",
        },
      ],
      nearbyAttractions: [
        { id: 1, name: "City Park", distance: "0.5 km" },
        { id: 2, name: "Museum of History", distance: "1.2 km" },
      ],
    };
    setHostelData(data);
  }, []);

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

  const handleAddItem = (section) => {
    const newItem = { id: Date.now(), ...getEmptyItem(section) };
    setHostelData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
    setEditingItem(newItem);
  };

  const handleRemoveItem = (section, id) => {
    setHostelData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
    setEditingItem(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHostelData((prev) => ({
          ...prev,
          gallery: [
            ...prev.gallery,
            { id: Date.now(), imageUrl: reader.result },
          ],
        }));
      };
      reader.readAsDataURL(file);
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

  const renderInfoTab = () => (
    <div>
      <InputField
        label="Hostel Name"
        value={hostelData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        placeholder="Enter hostel name"
      />
      <TextAreaField
        label="Description"
        value={hostelData.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        placeholder="Enter hostel description"
      />
      <InputField
        label="Location"
        value={hostelData.location}
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
          value={item[field.name]}
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

  const renderDynamicSection = (section, fields) => (
    <div>
      {hostelData[section].map((item) =>
        editingItem && editingItem.id === item.id
          ? renderEditForm(item, section, fields)
          : renderListItem(item, section, fields)
      )}
      <button
        onClick={() => handleAddItem(section)}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
      >
        <FaPlus className="mr-2" /> Add New {section.slice(0, -1)}
      </button>
    </div>
  );

  const renderGalleryTab = () => (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {hostelData.gallery.map((item) => (
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

  return (
    <div className="w-full h-full bg-gray-100 p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Hostel Page Content
      </h1>
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {Object.keys(tabContent).map((tab) => (
          <Tab
            key={tab}
            icon={<FaImage className="w-5 h-5" />}
            label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          />
        ))}
      </div>
      <div className="flex-grow bg-white rounded-lg shadow-md p-6 overflow-auto">
        {tabContent[activeTab]}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => console.log("Saving data:", hostelData)}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
        >
          <FaSave className="mr-2" /> Save All Changes
        </button>
      </div>
    </div>
  );
};

export default AdminUserView;
