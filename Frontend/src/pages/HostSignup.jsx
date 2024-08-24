import { useState } from "react";

export default function HostSignup() {
  const [formData, setFormData] = useState({
    hostelName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    location: "",
    address: "",
    description: "",
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-3xl bg-boxColor p-8 rounded-lg shadow-lg flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Register as Hostel Owner
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Hostel Name</label>
              <input
                type="text"
                name="hostelName"
                value={formData.hostelName}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
                placeholder="Enter your hostel name"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Email Address</label>
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
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
                placeholder="Enter your contact number"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
                placeholder="Enter the hostel location"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
                placeholder="Enter the full address"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Password</label>
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
            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Confirm Password</label>
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
          </div>
          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-transparent text-white border-gray-600 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              placeholder="Describe your hostel"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primaryColor text-white font-bold rounded-lg hover:bg-primaryHoverColor transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
