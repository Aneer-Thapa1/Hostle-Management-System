import React, { useState } from "react";
import arrowRightIcon from "../../assets/arrowRight.svg";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) tempErrors.subject = "Subject is required";
    if (!formData.message.trim()) tempErrors.message = "Message is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Here you would typically send the data to your backend
    }
  };

  return (
    <div className="flex flex-col w-full items-center mt-16 sm:mt-24 md:mt-32 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-between w-full max-w-7xl items-start gap-8 lg:gap-16">
        {/* Left side content */}
        <div className="w-full lg:w-1/2 space-y-8">
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold leading-snug">
            Get in <span className="text-primaryColor">Touch</span>
          </h2>
          <p className="text-gray-400 text-lg">
            We'd love to hear from you! Whether you have a question about our
            hostels, need help with a booking, or just want to say hello, we're
            here to help.
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <svg
                className="w-6 h-6 text-primaryColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-400">
                123 Hostel Street, City, Country
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <svg
                className="w-6 h-6 text-primaryColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-400">contact@yourhostel.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <svg
                className="w-6 h-6 text-primaryColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-gray-400">+1 234 567 890</span>
            </div>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full lg:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Your Name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent ${
                  errors.subject ? "border-red-500" : ""
                }`}
                placeholder="Subject of your message"
              />
              {errors.subject && (
                <p className="mt-2 text-sm text-red-400">{errors.subject}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-primaryColor focus:border-transparent ${
                  errors.message ? "border-red-500" : ""
                }`}
                placeholder="Your message here..."
              ></textarea>
              {errors.message && (
                <p className="mt-2 text-sm text-red-400">{errors.message}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-primaryColor hover:bg-primaryColor-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor transition-colors duration-300"
              >
                Send Message
                <img src={arrowRightIcon} alt="" className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
