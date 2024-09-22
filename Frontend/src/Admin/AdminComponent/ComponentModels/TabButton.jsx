import React from "react";
import { FaImage, FaBed, FaUtensils } from "react-icons/fa";
import { MdAttractions } from "react-icons/md";

const TabButton = ({ tab, activeTab, setActiveTab }) => {
  const getIcon = () => {
    switch (tab) {
      case "info":
        return <FaImage />;
      case "packages":
        return <FaBed />;
      case "facilities":
        return <FaImage />;
      case "gallery":
        return <FaImage />;
      case "meals":
        return <FaUtensils />;
      case "attractions":
        return <MdAttractions />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-4 py-2 ${
        activeTab === tab
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } rounded-t-lg transition-colors duration-200`}
    >
      {getIcon()}
      <span className="ml-2">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
    </button>
  );
};

export default TabButton;
