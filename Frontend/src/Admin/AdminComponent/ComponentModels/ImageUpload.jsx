import React from "react";
import { FaUpload } from "react-icons/fa";

const ImageUpload = ({ onImageUpload }) => (
  <div className="mt-4">
    <label className="flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
      <FaUpload className="w-8 h-8" />
      <span className="mt-2 text-base leading-normal">Select an image</span>
      <input
        type="file"
        className="hidden"
        onChange={onImageUpload}
        accept="image/*"
      />
    </label>
  </div>
);

export default ImageUpload;
