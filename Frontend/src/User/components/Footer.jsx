import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold mb-4">HostelEase</h2>
          <p className="text-gray-400 mb-4">
            Your home away from home. Experience affordable and comfortable
            stays in our vibrant hostel community.
          </p>
          <div className="flex space-x-4">
            <Facebook className="w-6 h-6 text-primaryColor hover:text-white transition-colors cursor-pointer" />
            <Twitter className="w-6 h-6 text-primaryColor hover:text-white transition-colors cursor-pointer" />
            <Instagram className="w-6 h-6 text-primaryColor hover:text-white transition-colors cursor-pointer" />
            <Linkedin className="w-6 h-6 text-primaryColor hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-primaryColor">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {[
              "Home",
              "About Us",
              "Rooms",
              "Facilities",
              "Events",
              "Contact",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primaryColor transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-primaryColor">
            Our Services
          </h3>
          <ul className="space-y-2">
            {[
              "Dormitory Beds",
              "Private Rooms",
              "Long-term Stays",
              "Group Bookings",
              "Airport Transfers",
              "Bike Rentals",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primaryColor transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-primaryColor">
            Contact Us
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primaryColor" />
              <a
                href="mailto:info@hostelhub.com"
                className="text-gray-400 hover:text-primaryColor transition-colors"
              >
                info@hostelhub.com
              </a>
            </li>
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-primaryColor" />
              <a
                href="tel:+1234567890"
                className="text-gray-400 hover:text-primaryColor transition-colors"
              >
                +1 (234) 567-890
              </a>
            </li>
            <li className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primaryColor" />
              <span className="text-gray-400">
                123 Backpacker St, Traveler City, TC 12345
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2024 HostelHub. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {["Privacy Policy", "Terms of Service", "House Rules"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-400 hover:text-primaryColor transition-colors"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
