import React, { useEffect, useState } from "react";

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
    <div className={`w-full flex flex-col gap-3`}>
      <div className="flex w-full justify-end">
        <div className="w-[65%] flex justify-between bg-white items-center py-2">
          <h1 className="font-medium text-[#636363]">{fullDate}</h1>
          <button className="bg-blue-500 text-white font-medium rounded-sm px-3 py-2 active:scale-95 transition-all ease-in-out">
            Create Booking
          </button>
        </div>
      </div>

      <div className="w-full bg-[#eef0f2] flex flex-col p-4 rounded-md ">
        {/* OVERVIEW */}
        <div className="w-full flex flex-col gap-3 bg-white rounded-sm p-3">
          <h1 className="font-semibold text-[18px] text-[#2c2c2c]">Overview</h1>
          <div className="w-full flex gap-3 "></div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
