import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import hms from "../../assets/Admin/hms.png";
import {
  IoHomeOutline,
  IoBookmarkOutline,
  IoPricetagsOutline,
  IoLogOutOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { GiTakeMyMoney } from "react-icons/gi";
import AdminDashboard from "../AdminComponent/AdminDashboard";
import AdminFrontDesk from "../AdminComponent/AdminFrontDesk";
import AdminGuest from "../AdminComponent/AdminGuest";
import AdminRoom from "../AdminComponent/AdminRoom";
import AdminBookings from "../AdminComponent/AdminBookings";
import AdminDeal from "../AdminComponent/AdminDeal";
import AddHostel from "../AdminComponent/ComponentModels/AddRoom";

const AdminPage = () => {
  const [active, setActive] = useState("dashboard");
  const [openModel, setModel] = useState(false);
  const [editData, setEditData] = useState();
  const navigate = useNavigate();

  const handleClick = (e, act) => {
    setActive(act);
    setModel(false);
  };

  const handleLogout = () => {
    // Clear all cookies
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });

    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Redirect to home page
    navigate("/");
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex gap-3 relative h-screen">
      {/* LEFT SECTION */}
      <div className="fixed top-0 left-0 w-[19%] h-screen bg-white flex flex-col gap-3 p-4 overflow-y-auto">
        <div className="w-full flex items-center my-2 mb-2 gap-2">
          <img className="w-14 h-14 object-cover" src={hms} alt="" />
          <h1 className="uppercase text-blue-500 font-semibold text-xl">
            novotel
          </h1>
        </div>
        <div className="w-full flex flex-col gap-4 flex-grow">
          <div
            onClick={(e) => handleClick(e, "dashboard")}
            className={`${
              active === "dashboard"
                ? "bg-blue-200 text-blue-500 font-medium"
                : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <IoHomeOutline className="w-6 h-6" />
            <h1>Dashboard</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "fd")}
            className={`${
              active === "fd" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <CiEdit className="w-6 h-6" />
            <h1>Front Desk</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "guest")}
            className={`${
              active === "guest" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <HiOutlineClipboardDocumentCheck className="w-6 h-6" />
            <h1>Guest</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "room")}
            className={`${
              active === "room" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <IoBookmarkOutline className="w-6 h-6" />
            <h1>Room</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "deal")}
            className={`${
              active === "deal" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <IoPricetagsOutline className="w-6 h-6" />
            <h1>Deal</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "bookings")}
            className={`${
              active === "bookings"
                ? "bg-blue-200 text-blue-500 font-medium"
                : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <IoCalendarOutline className="w-6 h-6" />
            <h1>Bookings</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "amenities")}
            className={`${
              active === "amenities"
                ? "bg-blue-200 text-blue-500 font-medium"
                : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <GiTakeMyMoney className="w-6 h-6" />
            <h1>Amenities</h1>
          </div>
        </div>

        {/* Logout option */}
        <div
          onClick={handleLogout}
          className="w-full flex gap-2 cursor-pointer hover:bg-red-200 hover:text-red-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group mt-auto"
        >
          <IoLogOutOutline className="w-6 h-6" />
          <h1>Logout</h1>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className={`w-[80%] flex flex-col gap-3 ml-[19%]`}>
        {/* This is DIV for the Search and profile */}
        <div className="w-full flex items-center my-2 mb-6 gap-2">
          <img className="w-14 h-14 object-cover" src="" alt="" />
          <h1 className="uppercase text-blue-500 font-semibold text-xl">
            novotel
          </h1>
        </div>
        {active === "dashboard" ? (
          <AdminDashboard />
        ) : active === "fd" ? (
          <AdminFrontDesk />
        ) : active === "guest" ? (
          <AdminGuest />
        ) : active === "deal" ? (
          <AdminDeal />
        ) : active === "room" ? (
          <AdminRoom setModel={setModel} setEditData={setEditData} />
        ) : active === "bookings" ? (
          <AdminBookings />
        ) : active === "amenities" ? (
          <div>Amenities Component</div> // Replace with actual Amenities component when available
        ) : null}

        {/* ADD ROOM POPUP MODEL */}
        {openModel && <AddHostel setModel={setModel} editData={editData} />}
      </div>
    </div>
  );
};

export default AdminPage;
