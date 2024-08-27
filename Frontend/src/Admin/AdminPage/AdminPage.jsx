import React, { useEffect, useState } from "react";
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
import AddHostel from "../AdminComponent/ComponentModels/AddHostel";

const AdminPage = () => {
  const [active, setActive] = useState("dashboard");
  const [openModel, setModel] = useState(false);

  const handleClick = (e, act) => {
    setActive(act);
    setModel(false);
  };

  useEffect(() => {
    // Add or remove the overflow-hidden class based on the openModel state
    if (openModel) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up the class when the component unmounts or openModel changes
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [openModel]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex gap-3">
      {/* LEFT SECTION */}
      <div className="fixed top-0 left-0 w-[19%] h-screen bg-white flex flex-col gap-3 p-4 overflow-y-auto">
        <div className="w-full flex items-center my-2 mb-2 gap-2">
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

      <div className={`w-[80%] flex flex-col gap-3 ml-[19%] relative`}>
        {/* This is DIV for the Serach and profile */}
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
          <AdminRoom setModel={setModel} />
        ) : (
          <AdminRate />
        )}

        {/* ADD ROOM POPUP MODEL */}
        {openModel && <AddHostel setModel={setModel} />}
      </div>
    </div>
  );
};

export default AdminPage;
