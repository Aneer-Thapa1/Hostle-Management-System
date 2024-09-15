import React, { useState } from "react";
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
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState("");

  const featuredHostels = [
    {
      id: 1,
      name: "Green Tortoise Hostel",
      location: "San Francisco, USA",
      price: 25,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 2,
      name: "Generator Hostel",
      location: "London, UK",
      price: 20,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 3,
      name: "Zostel",
      location: "Goa, India",
      price: 8,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1605796348246-9ab5be1202a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  const hostelReviews = [
    {
      id: 1,
      name: "Alex",
      content:
        "The communal kitchen was a great place to meet other guests and share travel tips!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Emma",
      content:
        "I loved the weekly pub crawl organized by the hostel. Made instant friends!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Liam",
      content:
        "The free walking tour suggested by the hostel staff was the highlight of my trip!",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Experience Hostel Life
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Connect with fellow travelers, create memories, and explore the
            world on a budget
          </p>

          <div className="bg-gray-800 rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where's your next adventure?"
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
              <button className="bg-primaryColor text-white px-6 py-3 rounded-lg hover:bg-primaryColor-dark transition duration-300">
                Find Hostels
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Top-Rated Hostels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHostels.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        </section>

        <section className="mb-16 bg-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Choose Hostel Life?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FeatureCard icon={FaBed} title="Budget-Friendly" />
            <FeatureCard icon={FaUsers} title="Social Atmosphere" />
            <FeatureCard icon={FaUtensils} title="Communal Spaces" />
            <FeatureCard icon={FaGlobe} title="Cultural Exchange" />
            <FeatureCard icon={FaMapMarkedAlt} title="Prime Locations" />
            <FeatureCard icon={FaWifi} title="Free Wi-Fi" />
            <FeatureCard icon={FaGuitar} title="Fun Events" />
            <FeatureCard icon={FaLock} title="Secure Storage" />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Traveler Experiences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hostelReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full mr-4"
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

        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Hostel Adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of travelers and start creating unforgettable
            memories!
          </p>
          <button className="bg-primaryColor text-white px-8 py-3 rounded-lg hover:bg-primaryColor-dark transition duration-300 text-lg font-semibold">
            Book Your Hostel Now
          </button>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQ
              question="What's unique about staying in a hostel?"
              answer="Hostels offer a social, budget-friendly environment where you can meet fellow travelers, share experiences, and often participate in organized activities and events."
            />
            <FAQ
              question="Are hostels safe for solo travelers?"
              answer="Most hostels prioritize guest safety with security measures like lockers, key card access, and 24/7 staff. Many solo travelers choose hostels for the social atmosphere and the opportunity to meet other travelers."
            />
            <FAQ
              question="What should I pack for a hostel stay?"
              answer="Essential items include a padlock for lockers, flip-flops for shared showers, a quick-dry towel, and earplugs. Don't forget a positive attitude and openness to meeting new people!"
            />
            <FAQ
              question="Can I stay in a hostel if I'm not in my 20s?"
              answer="Absolutely! Hostels welcome travelers of all ages. Many hostels cater to diverse age groups and offer private rooms in addition to dorms, making them suitable for various types of travelers."
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
          src={hostel.image}
          alt={hostel.name}
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
        <h3 className="text-xl font-semibold mb-2">{hostel.name}</h3>
        <p className="text-gray-400 text-sm mb-2 flex items-center">
          <FaMapMarkedAlt className="mr-1" />
          {hostel.location}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-primaryColor">
            ${hostel.price}
          </span>
          <span className="text-sm text-gray-400">per night</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(hostel.rating)
                    ? "text-yellow-500"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">{hostel.rating}</span>
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
