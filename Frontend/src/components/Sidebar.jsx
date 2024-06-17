import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import "../styles/sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { MdDashboard } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="upper">
        <p>
          <span>Hostle</span>Ease
        </p>
      </div>
      <div className="lower">
        <div className="items">
          <div className="item active">
            <MdDashboard />
            <Link to={"/dashboard"} className="item-txt">
              Dashboard
            </Link>
          </div>

          <div className="item">
            <MdDashboard />
            <Link to={"/students"} className="item-txt">
              Students
            </Link>
          </div>
          <div className="item">
            <MdDashboard />
            <Link to={"/staffs"} className="item-txt">
              Staffs
            </Link>
          </div>
          <div className="item">
            <MdDashboard />
            <Link to={"/rooms"} className="item-txt">
              Rooms
            </Link>
          </div>
        </div>

        <div className="logout-container">
          <div className="item">
            <FontAwesomeIcon icon={faRightFromBracket} />
            <Link to={"/dashboard"} className="logout">
              Logout{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
