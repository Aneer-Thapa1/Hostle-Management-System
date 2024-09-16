import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const loggedOutNavList = ["Find a Hostel", "Rental Guides", "Share Stories"];
  const loggedInNavList = ["Home", "Hostels", "My Bookings", "Messages"];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuth();
  }, []);

  const currentNavList = isLoggedIn ? loggedInNavList : loggedOutNavList;

  const handleLogout = () => {
    // Clear all items from localStorage
    localStorage.clear();

    // Update state
    setIsLoggedIn(false);

    // Close mobile menu if open
    setIsMobileMenuOpen(false);

    // Redirect to home page
    navigate("/");
  };

  return (
    <nav className="flex flex-wrap justify-between items-center w-screen h-24 px-4 py-4 z-30">
      <div className="flex items-center">
        <img src="/api/placeholder/100/50" alt="Logo" className="h-8 w-auto" />
      </div>

      <div className="hidden lg:block">
        <ul className="flex gap-16 text-white">
          {currentNavList.map((item, index) => (
            <li
              key={index}
              className="cursor-pointer hover:text-primaryColor font-semibold"
            >
              <Link to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden lg:flex gap-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border-2 border-primaryColor rounded-3xl px-6 py-3 text-white font-semibold cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <>
            <button className="bg-primaryColor text-white px-6 py-3 font-semibold rounded-3xl cursor-pointer">
              <Link to="/hostSignup">Become A Host</Link>
            </button>
            <button className="border-2 border-primaryColor rounded-3xl px-6 py-3 text-white font-semibold cursor-pointer">
              <Link to="/login">Login</Link>
            </button>
          </>
        )}
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="w-full lg:hidden mt-4 bg-primaryColor z-50">
          <ul className="flex flex-col gap-4 text-white">
            {currentNavList.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-primaryColor font-semibold"
              >
                <Link
                  to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 mt-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="border-2 border-primaryColor rounded-3xl px-6 py-3 text-white font-semibold cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
                <button className="bg-primaryColor text-white px-6 py-3 font-semibold rounded-3xl cursor-pointer">
                  <Link
                    to="/hostSignup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Become A Host
                  </Link>
                </button>
                <button className="border-2 border-primaryColor rounded-3xl px-6 py-3 text-white font-semibold cursor-pointer">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
