import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";

const AdminDashboard = () => {
  const [fullDate, setFullDate] = useState();

  // Function to convert a number to a day name
  const convertDay = (num) => {
    switch (num) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "Invalid day";
    }
  };

  // Function to convert a number to a month name
  const convertMonth = (num) => {
    switch (num) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      default:
        return "Invalid month";
    }
  };

  useEffect(() => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const day = convertDay(todayDate.getDay());
    const month = convertMonth(todayDate.getMonth());
    const date = todayDate.getDate();

    const full = `${day}, ${month} ${date}, ${year}`;
    setFullDate(full);
  }, []);

  return (
    <div className={`w-full flex flex-col gap-3 `}>
      <div className="flex w-full justify-end">
        <div className="w-[65%] flex justify-between bg-white items-center py-2">
          <h1 className="font-medium text-[#636363]">{fullDate}</h1>
          <button className="bg-blue-500 text-white font-medium rounded-sm px-3 py-2 active:scale-95 transition-all ease-in-out">
            Create Booking
          </button>
        </div>
      </div>

      <div className="w-full bg-[#eef0f2] flex flex-col p-4 rounded-md gap-6 pb-5">
        {/* OVERVIEW */}
        <div className="w-full flex flex-col gap-3 bg-white rounded-[4px] p-4">
          <h1 className="font-semibold text-[18px] text-[#2c2c2c]">Overview</h1>
          <div className="w-full grid grid-cols-5 gap-3 ">
            {/* CHECKIN */}
            <div className="flex gap-4">
              <h1 className="flex flex-col gap-1 py-[1px]">
                <span className="font-normal text-[16px] text-[#636363]">
                  Today's
                </span>{" "}
                <span className="font-medium text-[18px] text-[#5f5f5f]">
                  Check-in
                </span>
              </h1>
              <div className="text-[25px] text-blue-600 font-semibold flex items-center pt-5 justify-end">
                <p>23</p>
              </div>
            </div>

            {/* CHECKOUT */}
            <div className="flex gap-4">
              <h1 className="flex flex-col gap-1 py-[1px]">
                <span className="font-normal text-[16px] text-[#636363]">
                  Today's
                </span>{" "}
                <span className="font-medium text-[18px] text-[#5f5f5f]">
                  Check-out
                </span>
              </h1>
              <div className="text-[25px] text-blue-600 font-semibold flex items-center pt-5 justify-end">
                <p>13</p>
              </div>
            </div>

            {/* INHOTEL */}
            <div className="flex gap-4">
              <h1 className="flex flex-col gap-1 py-[1px]">
                <span className="font-normal text-[16px] text-[#636363]">
                  Today's
                </span>{" "}
                <span className="font-medium text-[18px] text-[#5f5f5f]">
                  in hotel
                </span>
              </h1>
              <div className="text-[25px] text-blue-600 font-semibold flex items-center pt-5 justify-end">
                <p>60</p>
              </div>
            </div>

            {/* AVAILABLE ROOM */}
            <div className="flex gap-4">
              <h1 className="flex flex-col gap-1 py-[1px]">
                <span className="font-normal text-[16px] text-[#636363]">
                  Today's
                </span>{" "}
                <span className="font-medium text-[18px] text-[#5f5f5f]">
                  Available room
                </span>
              </h1>
              <div className="text-[25px] text-blue-600 font-semibold flex items-center pt-5 justify-end">
                <p>10</p>
              </div>
            </div>

            {/* Occupied Room */}
            <div className="flex gap-4">
              <h1 className="flex flex-col gap-1 py-[1px]">
                <span className="font-normal text-[16px] text-[#636363]">
                  Today's
                </span>{" "}
                <span className="font-medium text-[18px] text-[#5f5f5f]">
                  Occupied room
                </span>
              </h1>
              <div className="text-[25px] text-blue-600 font-semibold flex items-center pt-5 justify-end">
                <p>90</p>
              </div>
            </div>
          </div>
        </div>
        {/* ROOMS */}
        <div className="w-full flex flex-col gap-3 bg-white rounded-[4px] p-4">
          <h1 className="font-semibold text-[18px] text-[#2c2c2c]">Rooms</h1>
          <div className="w-full grid grid-cols-4 gap-3 ">
            {/* SINGLE SHARING */}
            <div className="flex flex-col gap-2 border-[1px] rounded-md p-3">
              <div className="flex w-full justify-between items-center">
                <div className="bg-green-200 rounded-md text-green-800 font-medium px-3 py-1 text-sm">
                  2 Deals
                </div>
                <CiMenuKebab />
              </div>
              <div className="w-full flex flex-col gap-1">
                <h1 className="font-semibold text-[#636363]">Single Sharing</h1>
                <p className="font-medium text-[#636363] text-lg">
                  <span className="text-[22px] text-[#5d5d5d] font-semibold">
                    2
                  </span>
                  <span>/30</span>
                </p>
                <p className="font-medium text-[#636363] text-lg">
                  <span className="text-[20px] text-blue-600 font-semibold">
                    $ 568
                  </span>
                  <span>/ day</span>
                </p>
              </div>
            </div>

            {/* DOUBLE SHARING */}
            <div className="flex flex-col gap-2 border-[1px] rounded-md p-3">
              <div className="flex w-full justify-between items-center">
                <div className="bg-green-200 rounded-md text-green-800 font-medium px-3 py-1 text-sm">
                  2 Deals
                </div>
                <CiMenuKebab />
              </div>
              <div className="w-full flex flex-col gap-1">
                <h1 className="font-semibold text-[#636363]">Double Sharing</h1>
                <p className="font-medium text-[#636363] text-lg">
                  <span className="text-[22px] text-[#5d5d5d] font-semibold">
                    2
                  </span>
                  <span>/30</span>
                </p>
                <p className="font-medium text-[#636363] text-lg">
                  <span className="text-[20px] text-blue-600 font-semibold">
                    $ 1,068
                  </span>
                  <span>/ day</span>
                </p>
              </div>
            </div>

            {/* TRIPLE SHARING */}
            <div className="flex flex-col gap-2 border-[1px] rounded-md p-3">
              <div className="flex w-full justify-between items-center">
                <div className="bg-green-200 rounded-md text-green-800 font-medium px-3 py-1 text-sm">
                  {/* 2 Deals */}
                </div>
                <CiMenuKebab />
              </div>
              <div className="w-full flex flex-col gap-1">
                <h1 className="font-semibold text-[#636363]">Triple Sharing</h1>
                <p className="font-medium text-[#636363] text-lg">
                  <span className="text-[22px] text-[#5d5d5d] font-semibold">
                    2
                  </span>
                  <span>/30</span>
                </p>
                <p className="font-medium text-[#636363] text-lg">
                  <span className="text-[20px] text-blue-600 font-semibold">
                    $ 1,568
                  </span>
                  <span>/ day</span>
                </p>
              </div>
            </div>

            {/* VIP */}
            <div className="flex flex-col gap-2 border-[1px] rounded-md p-3">
              <div className="flex w-full justify-between items-center ">
                <div className="bg-green-200 rounded-md text-green-800 font-medium px-3 py-1 text-sm">
                  {/* 2 Deals */}
                </div>
                <CiMenuKebab />
              </div>
              <div className="w-full flex flex-col gap-1">
                <h1 className="font-semibold text-[#636363]">VIP Suit</h1>
                <p className="font-medium text-[#636363] text-lg">
                  <span className="text-[22px] text-[#5d5d5d] font-semibold">
                    2
                  </span>
                  <span>/30</span>
                </p>
                <p className="font-medium text-[#636363] text-lg">
                  <span className="text-[20px] text-blue-600 font-semibold">
                    $ 2,568
                  </span>
                  <span>/ day</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Room statue and Floor */}
        <div className="w-full flex gap-5">
          {/* Room status */}
          <div className="ROOM STATUS w-[60%] flex flex-col gap-2 bg-white p-4 rounded-[4px]">
            <h1 className="font-semibold text-[18px] text-[#2c2c2c]">
              Room status
            </h1>
            <div className="w-full flex gap-20 ">
              {/* Occupied Room */}
              <div className="w-full flex flex-col gap-1">
                <h1 className="text-[#636363] font-[550] w-full flex justify-between">
                  <span>Occupied rooms</span> <span>108</span>
                </h1>
                <p className="text-[#636363] w-full flex justify-between">
                  <span>Clean</span> <span>90</span>
                </p>
                <p className="text-[#636363] w-full flex justify-between">
                  <span>Dirty</span> <span>4</span>
                </p>
                <p className="text-[#636363] w-full flex justify-between">
                  <span>Inspected</span> <span>60</span>
                </p>
              </div>
              <div className="w-full flex flex-col gap-1">
                <h1 className="text-[#636363] font-[550] w-full flex justify-between">
                  <span>Available rooms</span> <span>20</span>
                </h1>
                <p className="text-[#636363] w-full flex justify-between">
                  <span>Clean</span> <span>30</span>
                </p>
                <p className="text-[#636363] w-full flex justify-between">
                  <span>Dirty</span> <span>19</span>
                </p>
                <p className="text-[#636363] w-full flex justify-between">
                  <span>Inspected</span> <span>30</span>
                </p>
              </div>
            </div>
          </div>

          <div className="w-[40%] bg-white flex flex-col gap-2 p-4">
            <h1 className="font-semibold text-[18px] text-[#2c2c2c]">
              Floor status
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
