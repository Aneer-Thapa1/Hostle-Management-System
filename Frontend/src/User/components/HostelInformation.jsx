import React from "react";
import {
  FaBed,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaInfoCircle,
} from "react-icons/fa";

const HostelInformation = ({ hostelData }) => {
  if (!hostelData) {
    return <div className="text-white">No hostel data available</div>;
  }

  const InfoSection = ({ title, icon, children }) => (
    <section className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      {children}
    </section>
  );

  const InfoItem = ({ label, value }) => (
    <p className="text-gray-300">
      <span className="font-medium">{label}:</span> {value || "Not specified"}
    </p>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Hostel Information</h2>

      <InfoSection
        title="Basic Details"
        icon={<FaInfoCircle className="text-primaryColor" />}
      >
        <InfoItem label="Hostel Name" value={hostelData.hostelName} />
        <InfoItem label="Owner Name" value={hostelData.ownerName} />
        <InfoItem label="Email" value={hostelData.email} />
        <InfoItem label="Contact" value={hostelData.contact} />
      </InfoSection>

      <InfoSection
        title="Location"
        icon={<FaMapMarkerAlt className="text-primaryColor" />}
      >
        <InfoItem label="Location" value={hostelData.location} />
        <InfoItem label="Address" value={hostelData.address} />
        <InfoItem label="Latitude" value={hostelData.latitude} />
        <InfoItem label="Longitude" value={hostelData.longitude} />
      </InfoSection>

      <InfoSection
        title="Description"
        icon={<FaInfoCircle className="text-primaryColor" />}
      >
        <p className="text-gray-300">{hostelData.description}</p>
      </InfoSection>

      <InfoSection
        title="Rating"
        icon={<FaStar className="text-primaryColor" />}
      >
        <InfoItem label="Average Rating" value={hostelData.avgRating} />
      </InfoSection>

      {hostelData.rooms && hostelData.rooms.length > 0 && (
        <InfoSection
          title="Rooms"
          icon={<FaBed className="text-primaryColor" />}
        >
          {hostelData.rooms.map((room, index) => (
            <div key={index} className="mb-2 text-gray-300">
              <p>
                <strong>Room {room.roomIdentifier}</strong>
              </p>
              <p>Type: {room.type}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Price: ${room.price}</p>
            </div>
          ))}
        </InfoSection>
      )}
    </div>
  );
};

export default HostelInformation;
