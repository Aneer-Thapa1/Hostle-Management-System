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
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-bold mb-4">HostelEase</h2>
          <p className="text-gray-400 mb-4">
            Simplifying hostel management and bookings. Connect with travelers
            and manage your hostel with ease.
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
            For Travelers
          </h3>
          <ul className="space-y-2">
            {[
              "Find Hostels",
              "Book a Bed",
              "Long-term Stays",
              "Group Bookings",
              "Travel Tips",
              "Community Events",
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
            For Hostel Owners
          </h3>
          <ul className="space-y-2">
            {[
              "List Your Hostel",
              "Manage Bookings",
              "Pricing Strategies",
              "Hostel Management Tools",
              "Owner Community",
              "Marketing Tips",
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
                href="mailto:support@hostelease.com"
                className="text-gray-400 hover:text-primaryColor transition-colors"
              >
                support@hostelease.com
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
                456 Backpacker Ave, Hostel Hub, HH 67890
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2024 HostelEase. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {["Privacy Policy", "Terms of Service", "Community Guidelines"].map(
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
