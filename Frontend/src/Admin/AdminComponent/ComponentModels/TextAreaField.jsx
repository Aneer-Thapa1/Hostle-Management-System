import React from "react";

const TextAreaField = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor={label}
    >
      {label}
    </label>
    <textarea
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows="4"
    />
  </div>
);

export default TextAreaField;
