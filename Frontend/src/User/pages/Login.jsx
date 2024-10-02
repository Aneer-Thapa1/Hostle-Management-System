import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        // Login successful
        const user = resultAction.payload.user;
        localStorage.setItem("token", resultAction.payload.token);

        // Redirect based on role
        if (user.role === "HOSTEL_OWNER") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        // Login failed
        console.error("Login error:", resultAction.error.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background bg-gradient-to-br from-background to-boxColor">
      <div className="w-full max-w-md bg-boxColor p-8 rounded-lg shadow-2xl transform hover:scale-105 transition duration-300">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border bg-gray-700 text-white border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor transition duration-300"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border bg-gray-700 text-white border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor transition duration-300"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primaryColor text-white font-bold rounded-lg hover:bg-primaryHoverColor transition duration-300 flex items-center justify-center"
          >
            Log In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-white">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-primaryColor hover:underline transition duration-300"
            >
              Sign Up
            </a>
          </p>
          <a
            href="/forgot-password"
            className="text-primaryColor hover:underline block mt-2 transition duration-300"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
