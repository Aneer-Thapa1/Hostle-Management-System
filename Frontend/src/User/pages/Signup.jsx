import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    userAddress: "",
    userContact: "",
    userEmail: "",
    userName: "",
    userPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userPassword, confirmPassword, ...rest } = formData;

    if (userPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        "http://localhost:8870/api/auth/signup",
        {
          ...rest,
          userPassword,
        }
      );

      if (response.status === 201) {
        setSuccessMessage("User registered successfully!");
        setError(null);

        setTimeout(() => {
          navigate("/login"); // Redirect after showing success message
        }, 2000); // 2-second delay before redirect
      }
    } catch (error) {
      setError("Failed to register user. Please try again.");
      console.error(error);
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md bg-boxColor p-8 rounded-lg shadow-lg flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <div>
            <label className="block text-white mb-2">Name</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">Email Address</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">Contact Number</label>
            <input
              type="text"
              name="userContact"
              value={formData.userContact}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              placeholder="Enter your contact number"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">Address</label>
            <input
              type="text"
              name="userAddress"
              value={formData.userAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              placeholder="Enter your address"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              placeholder="Confirm your password"
              required
            />
          </div>
          {successMessage && (
            <p className="text-green-500 text-center">{successMessage}</p>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-primaryColor text-white font-bold rounded-lg hover:bg-primaryHoverColor transition duration-300"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="loader"></div> {/* Add a loader animation */}
                <span className="ml-2">Signing Up...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="text-center text-white mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primaryColor ml-1 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
