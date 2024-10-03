import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import hms from "../../assets/Admin/hms.png";
import {
  FaHome,
  FaCalendarAlt,
  FaBed,
  FaUsers,
  FaMoneyBillWave,
  FaEye,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import AdminDashboard from "../AdminComponent/AdminDashboard";
import AdminBookings from "../AdminComponent/AdminBookings";
import AdminRooms from "../AdminComponent/AdminRoom";
import AdminPayments from "../AdminComponent/AdminPayments";
import AdminSettings from "../AdminComponent/AdminSettings";
import AdminUserView from "../AdminComponent/AdminUserView";
import AdminStudents from "../AdminComponent/AdminStudents";
import AdminFloatingChatInterface from "../AdminComponent/AdminFloatingChatInterface";

const AdminPage = () => {
  const [active, setActive] = useState("dashboard");
  const [openModel, setModel] = useState(false);
  const [editData, setEditData] = useState();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  const handleClick = (act) => {
    setActive(act);
    setModel(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Add any other necessary cleanup here
    navigate("/login");
  };

  const navItems = [
    { id: "dashboard", icon: FaHome, label: "Dashboard" },
    { id: "bookings", icon: FaCalendarAlt, label: "Bookings" },
    { id: "rooms", icon: FaBed, label: "Rooms" },
    { id: "students", icon: FaUsers, label: "Students" },
    { id: "payments", icon: FaMoneyBillWave, label: "Payments" },
    { id: "user-view", icon: FaEye, label: "User View" },
  ];

  const renderComponent = () => {
    switch (active) {
      case "dashboard":
        return <AdminDashboard />;
      case "bookings":
        return <AdminBookings />;
      case "rooms":
        return <AdminRooms setModel={setModel} setEditData={setEditData} />;
      case "payments":
        return <AdminPayments />;
      case "user-view":
        return <AdminUserView />;
      case "students":
        return <AdminStudents />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex gap-3 relative h-screen">
      {/* LEFT SECTION */}
      <div className="fixed top-0 left-0 w-[19%] h-screen bg-white flex flex-col p-4">
        <div className="w-full flex items-center my-2 mb-6 gap-2">
          <img className="w-14 h-14 object-cover" src={hms} alt="Hostel Logo" />
          <h1 className="uppercase text-blue-500 font-semibold text-xl">
            {user.hostelName || "Hostel Name"}
          </h1>
        </div>
        <div className="w-full flex-grow flex flex-col gap-4 overflow-y-auto">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`${
                active === item.id
                  ? "bg-blue-200 text-blue-500 font-medium"
                  : ""
              } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
            >
              <item.icon className="w-6 h-6" />
              <h1>{item.label}</h1>
            </div>
          ))}
        </div>
        {/* Separate logout button */}
        <div
          onClick={handleLogout}
          className="w-full flex gap-2 cursor-pointer hover:bg-red-200 hover:text-red-600 font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group mt-auto mb-4"
        >
          <FaSignOutAlt className="w-6 h-6" />
          <h1>Logout</h1>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-[80%] flex flex-col gap-3 ml-[19%]">
        <div className="w-full flex justify-between items-center my-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {active.charAt(0).toUpperCase() + active.slice(1)}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.name}</span>
            <img
              className="w-10 h-10 rounded-full"
              src={user.profileImage || "https://via.placeholder.com/40"}
              alt="Admin Avatar"
            />
          </div>
        </div>
        {renderComponent()}
      </div>
      <AdminFloatingChatInterface />
      {/* ADD ROOM POPUP MODEL */}
      {openModel && <AddHostel setModel={setModel} editData={editData} />}
    </div>
  );
};

export default AdminPage;
