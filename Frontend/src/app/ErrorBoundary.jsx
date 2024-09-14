import React from "react";
import { Link } from "react-router-dom";

const ErrorComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <svg
          className="w-32 h-32 mx-auto mb-8 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We're sorry, but we're having trouble loading this page. Please try
          again later.
        </p>
        <Link
          to="/"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorComponent;
