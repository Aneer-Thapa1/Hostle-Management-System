import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchPackages = async (hostelId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get(`${apiUrl}/api/content/packages`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { hostelId },
  });
  console.log(response);
  return response.data;
};

const BookingModal = ({ onClose, onSubmit }) => {
  const { id: hostelId } = useParams();
  console.log(hostelId);
  const [bookingInfo, setBookingInfo] = useState({
    packageId: "",
    hostelId: hostelId,
    numberOfPersons: "",
    checkInDate: "",
    bedPreference: "any",
    specialRequests: "",
    agreedToTerms: false,
  });

  console.log(bookingInfo);

  const [showPackageInfo, setShowPackageInfo] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    data: packages,
    isLoading,
    error,
  } = useQuery(["packages", hostelId], () => fetchPackages(hostelId), {
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!hostelId,
  });

  useEffect(() => {
    if (packages && packages.length > 0) {
      setSelectedPackage(packages[0]);
      setBookingInfo((prev) => ({ ...prev, packageId: packages[0].id }));
    }
  }, [packages]);

  useEffect(() => {
    calculateTotalPrice();
  }, [bookingInfo, selectedPackage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "packageId") {
      const selected = packages.find((pkg) => pkg.id === parseInt(value));
      setSelectedPackage(selected);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookingInfo.agreedToTerms) {
      setErrorMessage(
        "Please agree to the terms and conditions before booking."
      );
      setShowErrorDialog(true);
      return;
    }
    setShowConfirmDialog(true);
  };

  const calculateTotalPrice = () => {
    if (!selectedPackage || !bookingInfo.checkInDate) {
      setTotalPrice(0);
      return;
    }

    const calculatedPrice = selectedPackage.price * bookingInfo.numberOfPersons;
    setTotalPrice(calculatedPrice);
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
                  {selectedPackage.services &&
                    selectedPackage.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="checkInDate" className="block text-gray-300 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              value={bookingInfo.checkInDate}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded p-2"
              required
            />
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
            <p className="text-gray-300">Package: {selectedPackage?.name}</p>
            <p className="text-gray-300">
              Number of Persons: {bookingInfo.numberOfPersons}
            </p>
            <p className="text-gray-300">
              Duration: {selectedPackage?.duration} days
            </p>
            <p className="text-gray-300">
              Check-in Date: {bookingInfo.checkInDate || "Not specified"}
            </p>
            <p className="text-gray-300 font-bold">
              Total Price: Rs {totalPrice.toFixed(2)}
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

      {showErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-boxColor p-6 rounded-lg max-w-sm">
            <FaExclamationTriangle className="text-yellow-500 text-4xl mb-4 mx-auto" />
            <p className="text-white text-center mb-4">{errorMessage}</p>
            <button
              onClick={() => setShowErrorDialog(false)}
              className="w-full bg-primaryColor text-white py-2 rounded hover:bg-primaryColor-dark transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-boxColor p-6 rounded-lg max-w-sm">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Booking
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to proceed with this booking?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  onSubmit({
                    ...bookingInfo,
                    hostelId: parseInt(hostelId),
                    packageId: parseInt(bookingInfo.packageId),
                    numberOfPersons: parseInt(bookingInfo.numberOfPersons),
                    totalPrice,
                  });
                }}
                className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-primaryColor-dark transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingModal;
