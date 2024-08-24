import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        <h2 className="text-2xl font-bold text-center text-white">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700">Email Address</label>
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
            <label className="block text-gray-700">Password</label>
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
          <button
            type="submit"
            className="w-full py-3 bg-primaryColor text-white font-bold rounded-lg hover:bg-primaryHoverColor transition duration-300"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-white mt-4 ">
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
