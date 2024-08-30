import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
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

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        "http://localhost:8870/api/auth/login",
        formData
      );

      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      setError("Something went wrong! ");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md bg-boxColor p-8 rounded-lg shadow-lg flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-center text-white">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor bg-inputBg text-inputText placeholder-inputPlaceholder"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-white bg-transparent outline-none border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor bg-inputBg text-inputText placeholder-inputPlaceholder"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-primaryColor text-white font-bold rounded-lg hover:bg-primaryHoverColor transition duration-300"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="loader"></div> {/* Add a loader animation */}
                <span className="ml-2">Logging In...</span>
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>
        <p className="text-center text-white mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-primaryColor ml-1 hover:underline">
            Sign Up
          </a>
        </p>
        <p className="text-center text-gray-600 mt-2">
          <a
            href="/forgot-password"
            className="text-primaryColor hover:underline"
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
}
