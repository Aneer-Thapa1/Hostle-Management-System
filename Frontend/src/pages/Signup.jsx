import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md bg-boxColor p-8 rounded-lg shadow-lg flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
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
          <button
            type="submit"
            className="w-full py-3 bg-primaryColor text-white font-bold rounded-lg hover:bg-primaryHoverColor transition duration-300"
          >
            Sign Up
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
