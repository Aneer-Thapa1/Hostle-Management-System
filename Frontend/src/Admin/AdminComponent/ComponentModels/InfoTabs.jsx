import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaStar,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const baseURL = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const InfoTab = () => {
  const [hostelData, setHostelData] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHostelInfo();
  }, []);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchHostelInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/content/info`, {
        headers,
      });
      setHostelData(response.data);
      setEditForm(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching hostel info:", err);
      setError("Failed to load hostel information. Please try again later.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/api/content/info`, editForm, { headers });
      setHostelData(editForm);
      setShowPopup(false);
    } catch (err) {
      console.error("Error updating hostel info:", err);
      alert("Failed to update hostel information. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading hostel information...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Hostel Information</h2>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FaEdit className="mr-2" /> Edit
        </button>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-2 text-gray-800 border-b pb-2">
              Hostel Details
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <InfoItem label="Name" value={hostelData.hostelName} />
              <InfoItem label="Owner" value={hostelData.ownerName} />
              <InfoItem
                label="Email"
                value={hostelData.email}
                icon={<FaEnvelope className="text-gray-500" />}
              />
              <InfoItem
                label="Contact"
                value={hostelData.contact}
                icon={<FaPhone className="text-gray-500" />}
              />
              <InfoItem
                label="Location"
                value={hostelData.location}
                icon={<FaMapMarkerAlt className="text-gray-500" />}
              />
              <InfoItem label="Address" value={hostelData.address} />
              <InfoItem
                label="Coordinates"
                value={`${hostelData.latitude}, ${hostelData.longitude}`}
              />
              <InfoItem
                label="Rating"
                value={`${hostelData.avgRating} / 5`}
                icon={<FaStar className="text-yellow-400" />}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-2 text-gray-800 border-b pb-2">
              Description
            </h3>
            <p className="text-gray-600 text-sm">{hostelData.description}</p>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-2 text-gray-800 border-b pb-2">
              Hostel Image
            </h3>
            {hostelData.mainPhoto ? (
              <img
                src={hostelData.mainPhoto}
                alt="Hostel"
                className="w-full object-cover rounded-lg shadow-md"
                style={{ maxHeight: "300px" }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-500 text-sm">No image available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Edit Hostel Information
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Hostel Name"
                  name="hostelName"
                  value={editForm.hostelName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Owner Name"
                  name="ownerName"
                  value={editForm.ownerName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Contact"
                  name="contact"
                  value={editForm.contact}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Location"
                  name="location"
                  value={editForm.location}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Address"
                  name="address"
                  value={editForm.address}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={editForm.latitude}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={editForm.longitude}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Main Photo URL"
                  name="mainPhoto"
                  type="url"
                  value={editForm.mainPhoto}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  id="description"
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition duration-300 ease-in-out"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm transition duration-300 ease-in-out"
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

const InfoItem = ({ label, value, icon }) => (
  <div className="mb-1">
    <p className="text-xs text-gray-500 flex items-center">
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </p>
    <p className="font-semibold text-gray-800 text-sm">{value}</p>
  </div>
);

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  ...props
}) => (
  <div>
    <label
      className="block text-gray-700 text-xs font-bold mb-1"
      htmlFor={name}
    >
      {label}
    </label>
    <input
      className="w-full p-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      {...props}
    />
  </div>
);

export default InfoTab;
