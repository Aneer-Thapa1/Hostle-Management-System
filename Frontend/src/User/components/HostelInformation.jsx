import React from "react";
import {
  FaBed,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaLanguage,
  FaLeaf,
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
        icon={<FaBed className="text-primaryColor" />}
      >
        <InfoItem label="Name" value={hostelData.hostelName} />
        <InfoItem label="Type" value={hostelData.type} />
        <InfoItem label="Established" value={hostelData.establishedYear} />
      </InfoSection>

      <InfoSection
        title="Location & Accessibility"
        icon={<FaMapMarkerAlt className="text-primaryColor" />}
      >
        <InfoItem label="Address" value={hostelData.address} />
        <InfoItem
          label="Nearest Landmarks"
          value={hostelData.nearestLandmarks}
        />
        <InfoItem
          label="Distance from City Center"
          value={hostelData.distanceFromCenter}
        />
        <InfoItem
          label="Nearest Public Transport"
          value={hostelData.nearestTransport}
        />
      </InfoSection>

      <InfoSection
        title="Accommodation"
        icon={<FaBed className="text-primaryColor" />}
      >
        <InfoItem label="Total Capacity" value={hostelData.totalCapacity} />
        <InfoItem label="Room Types" value={hostelData.roomTypes?.join(", ")} />
        <InfoItem label="Bed Types" value={hostelData.bedTypes?.join(", ")} />
      </InfoSection>

      <InfoSection
        title="Facilities & Amenities"
        icon={<FaBed className="text-primaryColor" />}
      >
        {hostelData.amenities && hostelData.amenities.length > 0 ? (
          <ul className="list-disc list-inside text-gray-300">
            {hostelData.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">No amenities specified</p>
        )}
      </InfoSection>

      <InfoSection
        title="Services"
        icon={<FaBed className="text-primaryColor" />}
      >
        {hostelData.services && hostelData.services.length > 0 ? (
          <ul className="list-disc list-inside text-gray-300">
            {hostelData.services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">No services specified</p>
        )}
      </InfoSection>

      <InfoSection
        title="Rules & Policies"
        icon={<FaClock className="text-primaryColor" />}
      >
        <InfoItem label="Check-in Time" value={hostelData.checkInTime} />
        <InfoItem label="Check-out Time" value={hostelData.checkOutTime} />
        <InfoItem label="Curfew" value={hostelData.curfew || "No curfew"} />
        <InfoItem label="Age Restrictions" value={hostelData.ageRestrictions} />
        <InfoItem label="Pet Policy" value={hostelData.petPolicy} />
      </InfoSection>

      <InfoSection
        title="Payment Information"
        icon={<FaMoneyBillWave className="text-primaryColor" />}
      >
        <InfoItem
          label="Accepted Payment Methods"
          value={hostelData.paymentMethods?.join(", ")}
        />
        <InfoItem
          label="Cancellation Policy"
          value={hostelData.cancellationPolicy}
        />
      </InfoSection>

      <InfoSection
        title="Additional Information"
        icon={<FaLanguage className="text-primaryColor" />}
      >
        <InfoItem
          label="Languages Spoken"
          value={hostelData.languagesSpoken?.join(", ")}
        />
        <InfoItem
          label="Sustainability Practices"
          value={hostelData.sustainabilityPractices}
        />
        <InfoItem
          label="Local Recommendations"
          value={hostelData.localRecommendations}
        />
      </InfoSection>

      {hostelData.additionalNotes && (
        <InfoSection
          title="Additional Notes"
          icon={<FaLeaf className="text-primaryColor" />}
        >
          <p className="text-gray-300">{hostelData.additionalNotes}</p>
        </InfoSection>
      )}
    </div>
  );
};

export default HostelInformation;
