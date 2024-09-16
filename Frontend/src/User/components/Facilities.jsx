import React from "react";
import {
  FaWifi,
  FaUtensils,
  FaTshirt,
  FaLock,
  FaBook,
  FaGuitar,
  FaBiking,
  FaHiking,
  FaGamepad,
  FaCocktail,
  FaInfoCircle,
} from "react-icons/fa";

const Facilities = ({ amenities = [], activities = [] }) => {
  const facilityCategories = [
    { name: "General Amenities", icon: FaWifi },
    { name: "Kitchen Facilities", icon: FaUtensils },
    { name: "Laundry Facilities", icon: FaTshirt },
    { name: "Security", icon: FaLock },
    { name: "Entertainment", icon: FaGamepad },
  ];

  const activityCategories = [
    { name: "Social Events", icon: FaCocktail },
    { name: "Cultural Activities", icon: FaBook },
    { name: "Music & Arts", icon: FaGuitar },
    { name: "Outdoor Activities", icon: FaHiking },
    { name: "Sports & Fitness", icon: FaBiking },
  ];

  const FacilityItem = ({ item, Icon }) => (
    <div className="flex items-center space-x-2 text-gray-300">
      <Icon className="text-primaryColor" />
      <span>{item}</span>
    </div>
  );

  const CategorySection = ({ category, items, ItemComponent }) => {
    const filteredItems = items.filter((a) => a.category === category.name);

    if (filteredItems.length === 0) {
      return null; // Don't render empty categories
    }

    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
          <category.icon className="mr-2 text-primaryColor" />
          {category.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <ItemComponent key={index} item={item.name} Icon={category.icon} />
          ))}
        </div>
      </div>
    );
  };

  const NoDataMessage = ({ message }) => (
    <div className="flex items-center justify-center text-gray-400 py-8">
      <FaInfoCircle className="mr-2" />
      <span>{message}</span>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Facilities and Activities
      </h2>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Hostel Facilities</h3>
        {amenities.length > 0 ? (
          facilityCategories.map((category) => (
            <CategorySection
              key={category.name}
              category={category}
              items={amenities}
              ItemComponent={FacilityItem}
            />
          ))
        ) : (
          <NoDataMessage message="No facilities information available at the moment." />
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          Activities and Events
        </h3>
        {activities.length > 0 ? (
          activityCategories.map((category) => (
            <CategorySection
              key={category.name}
              category={category}
              items={activities}
              ItemComponent={FacilityItem}
            />
          ))
        ) : (
          <NoDataMessage message="No activities or events information available at the moment." />
        )}
      </div>
    </div>
  );
};

export default Facilities;
