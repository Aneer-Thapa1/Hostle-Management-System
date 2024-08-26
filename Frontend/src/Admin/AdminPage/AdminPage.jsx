import React, { useState } from "react";
import hms from "../../assets/Admin/hms.png";
import { IoHomeOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoPricetagsOutline } from "react-icons/io5";
import { GiTakeMyMoney } from "react-icons/gi";
import AdminDashboard from "../AdminComponent/AdminDashboard";
import AdminFrontDesk from "../AdminComponent/AdminFrontDesk";
import AdminGuest from "../AdminComponent/AdminGuest";
import AdminRoom from "../AdminComponent/AdminRoom";
import AdminRate from "../AdminComponent/AdminRate";
import AdminDeal from "../AdminComponent/AdminDeal";

const AdminPage = () => {
  const [active, setActive] = useState("dashboard");

  const handleClick = (e, act) => {
    setActive(act);
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex gap-1">
      <div className="w-[20%] bg-white flex flex-col gap-3 p-4">
        <div className="w-full flex items-center my-2 mb-2">
          <img className="w-14 h-14 object-cover" src={hms} alt="" />
          <h1 className="uppercase text-blue-500 font-semibold text-xl">
            novotel
          </h1>
        </div>
        <div className="w-full flex flex-col gap-4">
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
            onClick={(e) => handleClick(e, "rate")}
            className={`${
              active === "rate" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <GiTakeMyMoney className="w-6 h-6" />

            <h1>Rate</h1>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}

      <div className="w-[80%] py-10">
        {active === "dashboard" ? (
          <AdminDashboard />
        ) : active === "fd" ? (
          <AdminFrontDesk />
        ) : active === "guest" ? (
          <AdminGuest />
        ) : active === "deal" ? (
          <AdminDeal />
        ) : active === "room" ? (
          <AdminRoom />
        ) : (
          <AdminRate />
        )}
      </div>
    </div>
  );
};

export default AdminPage;