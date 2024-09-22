import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

const InfoTab = ({ hostelData, handleInputChange, updateHostelInfo }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [editForm, setEditForm] = useState({ ...hostelData });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateHostelInfo(editForm);
    setShowPopup(false);
  };

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hostel Information</h2>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
        >
          <FaEdit className="mr-2" /> Edit Info
        </button>
      </div>

      <div className="overflow-y-auto flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">
              Hostel Details
            </h3>
            <p>
              <strong>Name:</strong> {hostelData.hostelName}
            </p>
            <p>
              <strong>Location:</strong> {hostelData.location}
            </p>
            <p>
              <strong>Description:</strong> {hostelData.description}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">
              Hostel Image
            </h3>
            {hostelData.mainPhoto ? (
              <img
                src={hostelData.mainPhoto}
                alt="Hostel"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Edit Hostel Information
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="hostelName"
                >
                  Hostel Name
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  id="hostelName"
                  type="text"
                  value={editForm.hostelName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, hostelName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  id="location"
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  id="description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows="4"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
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

export default InfoTab;
