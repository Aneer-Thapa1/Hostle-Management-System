import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchPackages = async (hostelId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get(`${apiUrl}/api/content/packages`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { hostelId },
  });
  return response.data;
};

const BookingModal = ({ hostelId, onClose, onSubmit }) => {
  const [bookingInfo, setBookingInfo] = useState({
    packageId: "",
    numberOfPersons: 1,
    startDate: "",
    endDate: "",
    bedPreference: "any",
    specialRequests: "",
    agreedToTerms: false,
  });

  const [showPackageInfo, setShowPackageInfo] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const {
    data: packages,
    isLoading,
    error,
  } = useQuery(["packages", hostelId], () => fetchPackages(hostelId), {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (packages && packages.length > 0) {
      setSelectedPackage(packages[0]);
      setBookingInfo((prev) => ({ ...prev, packageId: packages[0].id }));
    }
  }, [packages]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "packageId") {
      const selected = packages.find((pkg) => pkg.id === value);
      setSelectedPackage(selected);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookingInfo.agreedToTerms) {
      alert("Please agree to the terms and conditions before booking.");
      return;
    }
    onSubmit(bookingInfo);
  };

  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    const days = Math.ceil(
      (new Date(bookingInfo.endDate) - new Date(bookingInfo.startDate)) /
        (1000 * 60 * 60 * 24)
    );
    return (
      selectedPackage.price *
      bookingInfo.numberOfPersons *
      (days / selectedPackage.duration)
    );
  };

  if (isLoading) return <div className="text-white">Loading packages...</div>;
  if (error)
    return (
      <div className="text-red-500">
        Error loading packages: {error.message}
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-boxColor w-11/12 max-w-2xl rounded-lg p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <IoMdClose size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Book Your Stay</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="packageId" className="block text-gray-300 mb-1">
              Select Package
            </label>
            <select
              id="packageId"
              name="packageId"
              value={bookingInfo.packageId}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded p-2"
              required
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - Rs {pkg.price} for {pkg.duration} days
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowPackageInfo(!showPackageInfo)}
              className="mt-1 text-primaryColor hover:text-primaryColor-light"
            >
              <FaInfoCircle className="inline mr-1" />
              {showPackageInfo ? "Hide" : "Show"} package details
            </button>
            {showPackageInfo && selectedPackage && (
              <div className="mt-2 p-2 bg-gray-700 rounded">
                <h4 className="font-bold">{selectedPackage.name}</h4>
                <p>{selectedPackage.description}</p>
                <ul className="list-disc list-inside">
                  {selectedPackage.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-gray-300 mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={bookingInfo.startDate}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white rounded p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-gray-300 mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={bookingInfo.endDate}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white rounded p-2"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="numberOfPersons"
                className="block text-gray-300 mb-1"
              >
                Number of Persons
              </label>
              <input
                type="number"
                id="numberOfPersons"
                name="numberOfPersons"
                value={bookingInfo.numberOfPersons}
                onChange={handleInputChange}
                min="1"
                className="w-full bg-gray-700 text-white rounded p-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="bedPreference"
                className="block text-gray-300 mb-1"
              >
                Bed Preference
              </label>
              <select
                id="bedPreference"
                name="bedPreference"
                value={bookingInfo.bedPreference}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white rounded p-2"
              >
                <option value="any">No preference</option>
                <option value="lower">Lower bed</option>
                <option value="upper">Upper bed</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="specialRequests"
              className="block text-gray-300 mb-1"
            >
              Special Requests
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={bookingInfo.specialRequests}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded p-2"
              rows="3"
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreedToTerms"
              name="agreedToTerms"
              checked={bookingInfo.agreedToTerms}
              onChange={handleInputChange}
              className="mr-2"
              required
            />
            <label htmlFor="agreedToTerms" className="text-gray-300">
              I agree to the{" "}
              <a href="#" className="text-primaryColor hover:underline">
                terms and conditions
              </a>
            </label>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="text-lg font-bold text-white mb-2">
              Booking Summary
            </h3>
            <p className="text-gray-300">
              Total Price: Rs {calculateTotalPrice().toFixed(2)}
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-primaryColor text-white py-2 rounded hover:bg-primaryColor-dark transition-colors duration-200"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
