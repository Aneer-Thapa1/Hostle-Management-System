import React, { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { WidgetLoader, Widget } from "react-cloudinary-upload-widget";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const cloudinaryConfig = {
  cloudName: "dwx7fqwrh",
  uploadPreset: "Hostel Management",
};

const steps = [
  "Basic Info",
  "Contact",
  "Location",
  "Security",
  "Description & Photo",
];

const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${
                index <= currentStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`mt-2 text-xs ${
                index <= currentStep ? "text-blue-500" : "text-gray-400"
              }`}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-4">
        <div className="absolute top-0 h-1 w-full bg-gray-700 rounded"></div>
        <div
          className="absolute top-0 h-1 bg-blue-500 rounded transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) => (
  <div className="flex flex-col mb-4">
    <label className="text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border bg-gray-700 text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500" : ""
      }`}
      placeholder={placeholder}
      required
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const registerOwner = async (data) => {
  console.log("Sending data to backend:", data);
  const response = await axios.post(`${apiUrl}/api/auth/registerOwner`, data);
  return response.data;
};

export default function HostSignup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [formData, setFormData] = useState({
    hostelName: "",
    ownerName: "",
    email: "",
    contact: "",
    location: "",
    address: "",
    latitude: "",
    longitude: "",
    password: "",
    description: "",
    mainPhoto: "",
  });

  console.log(formData);
  const [errors, setErrors] = useState({});

  const mutation = useMutation(registerOwner, {
    onSuccess: (data) => {
      console.log("Registration successful", data);
      navigate("/login");
    },
    onError: (error) => {
      console.error("Registration failed", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
      setIsConfirming(false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoUpload = (result, error) => {
    if (error) {
      console.error("Error during upload:", error);

      setErrors((prev) => ({ ...prev, mainPhoto: "Failed to upload photo" }));
      return;
    }

    console.log("Upload result:", result);

    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      console.log("Upload successful. Image URL:", imageUrl);

      setFormData((prev) => ({
        ...prev,
        mainPhoto: imageUrl,
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    switch (currentStep) {
      case 0:
        if (!formData.hostelName.trim())
          newErrors.hostelName = "Hostel name is required";
        if (!formData.ownerName.trim())
          newErrors.ownerName = "Owner name is required";
        break;
      case 1:
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Email is invalid";
        if (!formData.contact.trim())
          newErrors.contact = "Contact number is required";
        break;
      case 2:
        if (!formData.location.trim())
          newErrors.location = "Location is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.latitude.trim())
          newErrors.latitude = "Latitude is required";
        if (!formData.longitude.trim())
          newErrors.longitude = "Longitude is required";
        break;
      case 3:
        if (!formData.password) newErrors.password = "Password is required";
        break;
      case 4:
        if (!formData.description.trim())
          newErrors.description = "Description is required";
        if (!formData.mainPhoto) newErrors.mainPhoto = "Main photo is required";
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else if (!isConfirming) {
        setIsConfirming(true);
      } else {
        console.log("Submitting form data:", formData);
        mutation.mutate(formData);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderFormFields = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Input
              label="Hostel Name"
              name="hostelName"
              value={formData.hostelName}
              onChange={handleChange}
              placeholder="Enter your hostel name"
              error={errors.hostelName}
            />
            <Input
              label="Owner Name"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Enter your name"
              error={errors.ownerName}
            />
          </>
        );
      case 1:
        return (
          <>
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
            />
            <Input
              label="Contact Number"
              name="contact"
              type="tel"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your contact number"
              error={errors.contact}
            />
          </>
        );
      case 2:
        return (
          <>
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter the hostel location"
              error={errors.location}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter the full address"
              error={errors.address}
            />
            <Input
              label="Latitude"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Enter latitude"
              error={errors.latitude}
            />
            <Input
              label="Longitude"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Enter longitude"
              error={errors.longitude}
            />
          </>
        );
      case 3:
        return (
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
          />
        );
      case 4:
        return (
          <>
            <div className="flex flex-col mb-4">
              <label className="text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border bg-gray-700 text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Describe your hostel"
                rows="4"
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="text-gray-300 mb-1">Main Photo</label>
              {!formData.mainPhoto ? (
                <Widget
                  sources={["local"]}
                  resourceType={"image"}
                  cloudName={cloudinaryConfig.cloudName}
                  uploadPreset={cloudinaryConfig.uploadPreset}
                  buttonText={"Upload Photo"}
                  style={{
                    color: "white",
                    border: "none",
                    width: "120px",
                    backgroundColor: "#3B82F6",
                    borderRadius: "5px",
                    height: "40px",
                  }}
                  folder={"hostel_photos"}
                  cropping={false}
                  multiple={false}
                  autoClose={false}
                  onSuccess={handlePhotoUpload}
                  onFailure={(e) => console.error("Upload failed:", e)}
                  logging={true}
                  customPublicId={"sample"}
                  eager={"w_400,h_300,c_pad|w_260,h_200,c_crop"}
                  use_filename={false}
                />
              ) : (
                <div className="mt-2">
                  <img
                    src={formData.mainPhoto}
                    alt="Hostel"
                    className="w-full max-w-xs rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, mainPhoto: "" }))
                    }
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
              {errors.mainPhoto && (
                <p className="text-red-500 text-sm mt-1">{errors.mainPhoto}</p>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <WidgetLoader />
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Register as Hostel Owner
        </h2>
        <ProgressIndicator currentStep={currentStep} />
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderFormFields()}
          {errors.submit && (
            <div className="text-red-500 text-sm mt-2">{errors.submit}</div>
          )}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Previous
              </button>
            )}
            <button
              type="submit"
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 
              ${currentStep === 0 ? "ml-auto" : ""} 
              ${mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={mutation.isLoading}
            >
              {currentStep === steps.length - 1
                ? isConfirming
                  ? "Confirm"
                  : "Register"
                : "Next"}
            </button>
          </div>
        </form>
      </div>
      {isConfirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Registration
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to register with the provided information?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirming(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Confirming submission with data:", formData);
                  mutation.mutate(formData);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Confirm
              </button>
            </div>{" "}
          </div>
        </div>
      )}
      {mutation.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-white mt-4">Registering...</p>
          </div>
        </div>
      )}
    </div>
  );
}
