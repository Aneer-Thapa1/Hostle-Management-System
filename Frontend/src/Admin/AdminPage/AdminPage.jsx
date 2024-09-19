import React, { useState } from "react";
import hms from "../../assets/Admin/hms.png";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineBedroomParent } from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { RiCustomerService2Line } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { GiMoneyStack } from "react-icons/gi";
import { AiFillEye } from "react-icons/ai";

import AdminDashboard from "../AdminComponent/AdminDashboard";
import AdminBookings from "../AdminComponent/AdminBookings";
import AdminRooms from "../AdminComponent/AdminRoom";
import AdminDeals from "../AdminComponent/AdminDeal";
import AdminPayments from "../AdminComponent/AdminPayments";
import AdminReports from "../AdminComponent/AdminReports";
import AdminSettings from "../AdminComponent/AdminSettings";
import AdminUserView from "../AdminComponent/AdminUserView";

const AdminPage = () => {
  const [active, setActive] = useState("dashboard");
  const [openModel, setModel] = useState(false);
  const [editData, setEditData] = useState();

  const handleClick = (act) => {
    setActive(act);
    setModel(false);
  };

  const navItems = [
    { id: "dashboard", icon: IoHomeOutline, label: "Dashboard" },
    { id: "bookings", icon: FaRegCalendarAlt, label: "Bookings" },
    { id: "rooms", icon: MdOutlineBedroomParent, label: "Rooms" },
    { id: "deals", icon: IoPricetagsOutline, label: "Deals" },
    { id: "payments", icon: GiMoneyStack, label: "Payments" },
    { id: "reports", icon: RiCustomerService2Line, label: "Reports" },
    { id: "user-view", icon: AiFillEye, label: "User View" },
    { id: "settings", icon: FiSettings, label: "Settings" },
  ];

  const renderComponent = () => {
    switch (active) {
      case "dashboard":
        return <AdminDashboard />;
      case "bookings":
        return <AdminBookings />;
      case "rooms":
        return <AdminRooms setModel={setModel} setEditData={setEditData} />;
      case "deals":
        return <AdminDeals />;
      case "payments":
        return <AdminPayments />;
      case "reports":
        return <AdminReports />;
      case "user-view":
        return <AdminUserView />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex gap-3 relative h-screen">
      {/* LEFT SECTION */}
      <div className="fixed top-0 left-0 w-[19%] h-screen bg-white flex flex-col gap-3 p-4 overflow-y-auto">
        <div className="w-full flex items-center my-2 mb-6 gap-2">
          <img className="w-14 h-14 object-cover" src={hms} alt="Hostel Logo" />
          <h1 className="uppercase text-blue-500 font-semibold text-xl">
            Hostel Name
          </h1>
        </div>
        <div className="w-full flex flex-col gap-4">
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
      </div>

      {/* RIGHT SECTION */}
      <div className="w-[80%] flex flex-col gap-3 ml-[19%]">
        <div className="w-full flex justify-between items-center my-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {active.charAt(0).toUpperCase() + active.slice(1)}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin Name</span>
            <img
              className="w-10 h-10 rounded-full"
              src="https://via.placeholder.com/40"
              alt="Admin Avatar"
            />
          </div>
        </div>
        {renderComponent()}
      </div>

      {/* ADD ROOM POPUP MODEL */}
      {openModel && <AddHostel setModel={setModel} editData={editData} />}
    </div>
  );
};

export default AdminPage;
