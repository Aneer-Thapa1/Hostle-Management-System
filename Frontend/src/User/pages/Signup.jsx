import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaHome, FaLock } from "react-icons/fa";

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      {...props}
      className="w-full pl-10 pr-3 py-2 border bg-gray-700 text-white border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
    />
  </div>
);

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userContact: "",
    userAddress: "",
    userPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.userName || !formData.userEmail) {
          setError("Please fill in all fields");
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
          setError("Please enter a valid email address");
          return false;
        }
        break;
      case 2:
        if (!formData.userContact || !formData.userAddress) {
          setError("Please fill in all fields");
          return false;
        }
        break;
      case 3:
        if (formData.userPassword !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (formData.userPassword.length < 6) {
          setError("Password must be at least 6 characters long");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8870/api/auth/signup",
        {
          userName: formData.userName,
          userEmail: formData.userEmail,
          userContact: formData.userContact,
          userAddress: formData.userAddress,
          userPassword: formData.userPassword,
        }
      );

      if (response.status === 201) {
        setSuccessMessage("User registered successfully!");
        setError(null);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setError("Failed to register user. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <InputField
              icon={<FaUser className="text-gray-400" />}
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            <InputField
              icon={<FaEnvelope className="text-gray-400" />}
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <InputField
              icon={<FaPhone className="text-gray-400" />}
              type="text"
              name="userContact"
              value={formData.userContact}
              onChange={handleChange}
              placeholder="Enter your contact number"
              required
            />
            <InputField
              icon={<FaHome className="text-gray-400" />}
              type="text"
              name="userAddress"
              value={formData.userAddress}
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <InputField
              icon={<FaLock className="text-gray-400" />}
              type="password"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <InputField
              icon={<FaLock className="text-gray-400" />}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Sign Up
        </h2>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  s <= step
                    ? "bg-primaryColor text-white"
                    : "bg-gray-600 text-gray-400"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600 transform -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-primaryColor transform -translate-y-1/2 transition-all duration-300 ease-in-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-center mt-2">{successMessage}</p>
          )}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-blue-600 transition duration-300 ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-blue-600 transition duration-300 ml-auto"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            )}
          </div>
        </form>
        <p className="text-center text-white mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-primaryColor hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
