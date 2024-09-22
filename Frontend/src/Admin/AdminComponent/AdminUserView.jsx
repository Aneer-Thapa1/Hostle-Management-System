import React, { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";

import InfoTab from "./ComponentModels/InfoTabs";
import PackagesTab from "./ComponentModels/PackagesTab";
import FacilitiesTab from "./ComponentModels/FacilitiesTab";
import GalleryTab from "./ComponentModels/GalleryTab";
import MealsTab from "./ComponentModels/MealsTab";
import AttractionsTab from "./ComponentModels/AttractionsTab";
import TabButton from "./ComponentModels/TabButton";

import { useHostelApi } from "../AdminComponent/ComponentModels/useHostelApi";

const AdminUserView = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [hostelData, setHostelData] = useState({
    name: "",
    description: "",
    location: "",
    packages: [],
    facilities: [],
    gallery: [],
    meals: [],
    nearbyAttractions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { error, fetchHostelInfo, updateHostelInfo } = useHostelApi();

  useEffect(() => {
    fetchHostelData();
  }, []);

  const fetchHostelData = async () => {
    setIsLoading(true);
    try {
      const info = await fetchHostelInfo();
      setHostelData(info);
    } catch (err) {
      console.error("Error fetching hostel data:", err);
    }
    setIsLoading(false);
  };

  const handleInputChange = (section, value) => {
    setHostelData((prev) => ({ ...prev, [section]: value }));
  };

  const saveChanges = async () => {
    try {
      await updateHostelInfo({
        name: hostelData.name,
        description: hostelData.description,
        location: hostelData.location,
      });
      alert("Changes saved successfully!");
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };

  const tabContent = {
    info: (
      <InfoTab hostelData={hostelData} handleInputChange={handleInputChange} />
    ),
    packages: (
      <PackagesTab hostelData={hostelData} setHostelData={setHostelData} />
    ),
    facilities: (
      <FacilitiesTab hostelData={hostelData} setHostelData={setHostelData} />
    ),
    gallery: (
      <GalleryTab hostelData={hostelData} setHostelData={setHostelData} />
    ),
    meals: <MealsTab hostelData={hostelData} setHostelData={setHostelData} />,
    attractions: (
      <AttractionsTab hostelData={hostelData} setHostelData={setHostelData} />
    ),
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full h-full bg-gray-100 p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Hostel Page Content
      </h1>
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {Object.keys(tabContent).map((tab) => (
          <TabButton
            key={tab}
            tab={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>
      <div className="flex-grow bg-white rounded-lg shadow-md p-6 overflow-auto">
        {tabContent[activeTab]}
      </div>
    </div>
  );
};

export default AdminUserView;
