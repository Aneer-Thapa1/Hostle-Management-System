import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import {
  FaSearch,
  FaRegCalendar,
  FaBed,
  FaUsers,
  FaUtensils,
  FaGlobe,
  FaMapMarkedAlt,
  FaWifi,
  FaGuitar,
  FaLock,
  FaHeart,
  FaStar,
  FaSpinner,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchFeaturedHostels = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/hostels/featured`);
  return response.data;
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const navigate = useNavigate();

  const {
    data: featuredHostels,
    isLoading,
    error,
  } = useQuery("featuredHostels", fetchFeaturedHostels);

  const hostelReviews = [
    {
      id: 1,
      name: "Alex",
      content:
        "The communal kitchen was a great place to meet other guests and share stories!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Emma",
      content:
        "I loved the weekly events organized by the hostel. Made instant friends!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Liam",
      content:
        "The free city tour suggested by the hostel staff was the highlight of my stay!",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];

  const handleSearch = () => {
    navigate(`/hostels?search=${searchQuery}&checkIn=${checkInDate}`);
  };

  const handleBookNow = () => {
    navigate("/hostels");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10"></div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 relative z-10">
            Find Your
            <br />
            <span className="text-primaryColor">Perfect Hostel</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 relative z-10">
            Experience community living, make new friends, and enjoy
            budget-friendly accommodations
          </p>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where are you heading?"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <div className="relative">
                  <FaRegCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor text-white"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="bg-primaryColor text-white px-6 py-3 rounded-lg hover:bg-primaryColor-dark transition duration-300 transform hover:scale-105"
                onClick={handleSearch}
              >
                Find Hostels
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Top-Rated Hostels
          </h2>
          {isLoading ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin text-4xl text-primaryColor" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Error loading featured hostels. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHostels.slice(0, 3).map((hostel) => (
                <HostelCard key={hostel.id} hostel={hostel} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-16 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Choose Hostel Life?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FeatureCard icon={FaBed} title="Affordable Stays" />
            <FeatureCard icon={FaUsers} title="Social Atmosphere" />
            <FeatureCard icon={FaUtensils} title="Communal Spaces" />
            <FeatureCard icon={FaGlobe} title="Cultural Exchange" />
            <FeatureCard icon={FaMapMarkedAlt} title="Central Locations" />
            <FeatureCard icon={FaWifi} title="Free Wi-Fi" />
            <FeatureCard icon={FaGuitar} title="Fun Events" />
            <FeatureCard icon={FaLock} title="Secure Lockers" />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Hostel Experiences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hostelReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-800 rounded-lg shadow-xl p-6 transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-primaryColor"
                  />
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="text-yellow-500">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{review.content}"</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 text-center bg-gradient-to-r from-primaryColor to-secondaryColor rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Hostel Adventure?
          </h2>
          <p className="text-xl text-white mb-8">
            Join our community of backpackers and start creating unforgettable
            memories!
          </p>
          <button
            className="bg-white text-primaryColor px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 text-lg font-semibold transform hover:scale-105"
            onClick={handleBookNow}
          >
            Book Your Bed Now
          </button>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQ
              question="What's unique about staying in a hostel?"
              answer="Hostels offer a social, budget-friendly environment where you can meet fellow backpackers, share experiences, and often participate in organized activities and events."
            />
            <FAQ
              question="Are hostels safe?"
              answer="Most hostels prioritize guest safety with security measures like lockers, key card access, and 24/7 staff. Many solo backpackers choose hostels for the social atmosphere and the opportunity to meet other guests."
            />
            <FAQ
              question="What should I pack for a hostel stay?"
              answer="Essential items include a padlock for lockers, flip-flops for shared showers, a quick-dry towel, and earplugs. Don't forget a positive attitude and openness to meeting new people!"
            />
            <FAQ
              question="Can I stay in a hostel if I'm not in my 20s?"
              answer="Absolutely! Hostels welcome guests of all ages. Many hostels cater to diverse age groups and offer private rooms in addition to dorms, making them suitable for various types of backpackers."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const HostelCard = ({ hostel }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="relative">
        <img
          src={hostel.mainPhoto || "https://via.placeholder.com/300x200"}
          alt={hostel.hostelName}
          className="w-full h-48 object-cover"
        />
        <button
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-50 rounded-full transition-all duration-300 hover:bg-opacity-100"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <FaHeart
            className={`w-5 h-5 ${
              isFavorite ? "text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{hostel.hostelName}</h3>
        <p className="text-gray-400 text-sm mb-2 flex items-center">
          <FaMapMarkedAlt className="mr-1" />
          {hostel.location}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-primaryColor">
            ${hostel.lowestPrice}
          </span>
          <span className="text-sm text-gray-400">per night</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(hostel.avgRating)
                    ? "text-yellow-500"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {hostel.avgRating.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-700">
        <button className="w-full bg-primaryColor text-white py-2 rounded-md hover:bg-primaryColor-dark transition duration-300">
          Book Now
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title }) => (
  <div className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition duration-300">
    <Icon className="text-4xl text-primaryColor mx-auto mb-2" />
    <h3 className="text-lg font-semibold">{title}</h3>
  </div>
);

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <button
        className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{question}</span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-700">
          <p className="text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
