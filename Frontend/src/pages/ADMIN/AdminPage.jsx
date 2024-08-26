import React, { useState } from "react";
import home from "../../assets/Admin/blue_home.png";

const AdminPage = () => {
  const [active, setActive] = useState("dashboard");

  const handleClick = (e, act) => {
    setActive(act);
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex gap-1">
      <div className="w-[20%] bg-white flex flex-col gap-3 p-4">
        <img src="" alt="logo" />
        <div className="w-full flex flex-col gap-4">
          <div
            onClick={(e) => handleClick(e, "dashboard")}
            className={`${
              active === "dashboard"
                ? "bg-blue-200 text-blue-500 font-medium"
                : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <img
              className={`w-6 h-6 group-hover:hidden`}
              src="https://cdn-icons-png.flaticon.com/128/738/738822.png"
              alt="dash"
            />
            <img
              className="w-6 h-6 hidden group-hover:inline"
              src={home}
              alt="dash"
            />
            <h1>Dashboard</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "fd")}
            className={`${
              active === "fd" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <img
              className="w-6 h-6"
              src="https://cdn-icons-png.flaticon.com/128/17590/17590842.png"
              alt="dash"
            />
            <h1>Front Desk</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "guest")}
            className={`${
              active === "guest" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <img
              className="w-6 h-6"
              src="https://cdn-icons-png.flaticon.com/128/4203/4203868.png"
              alt="dash"
            />
            <h1>Guest</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "room")}
            className={`${
              active === "room" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <img
              className="w-6 h-6"
              src="https://cdn-icons-png.flaticon.com/128/3106/3106777.png"
              alt="dash"
            />
            <h1>Room</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "deal")}
            className={`${
              active === "deal" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <img
              className="w-6 h-6"
              src="https://cdn-icons-png.flaticon.com/128/5412/5412910.png"
              alt="dash"
            />
            <h1>Deal</h1>
          </div>
          <div
            onClick={(e) => handleClick(e, "rate")}
            className={`${
              active === "rate" ? "bg-blue-200 text-blue-500 font-medium" : ""
            } w-full flex gap-2 cursor-pointer hover:bg-blue-200 hover:text-blue-600 hover:font-medium py-[6px] px-3 rounded-sm transition-all duration-300 group`}
          >
            <img
              className="w-6 h-6"
              src="https://cdn-icons-png.flaticon.com/128/2454/2454282.png"
              alt="dash"
            />
            <h1>Rate</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
