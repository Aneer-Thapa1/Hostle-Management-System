import React from "react";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="user-profile">
        <div className="user-txt">
          <p>Hari Bahadur</p>
          <span>Admin</span>
        </div>
        <img
          src="https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile.png"
          alt=""
          className="user-profile"
        />
      </div>
    </div>
  );
};

export default Navbar;
