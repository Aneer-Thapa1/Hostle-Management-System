import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navList = ["Find a Hostel", "Rental Guides", "Share Stories"];
  return (
    <nav className="flex  justify-around gap-5 w-screen h-24 items-center z-30">
      <img src={logo} alt="Logo" />
      <ul className="flex gap-16 text-white ">
        {navList.map((item, index) => (
          <li
            key={index}
            className="cursor-pointer hover:text-primaryColor font-semibold"
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <button className="bg-primaryColor text-white px-6 py-3 font-semibold rounded-3xl cursor-pointer">
          <Link to="/adminSignup"> Become A Host</Link>
        </button>
        <button className="border-2 border-primaryColor rounded-3xl px-6 text-white font-semibold cursor-pointer">
          <Link to="/login">Login</Link>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
