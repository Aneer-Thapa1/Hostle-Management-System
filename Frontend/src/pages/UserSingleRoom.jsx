import React from "react";
import Navbar from "../components/Navbar";
import { IoIosStarOutline } from "react-icons/io";
import { IoMdStar } from "react-icons/io";
import hostelImage from "../assets/aboutImage1.svg";

const UserSingleRoom = () => {
  return (
    <div className="bg-background w-screen h-screen flex flex-col gap-8">
      <div className="abslute top-0 left-0 z-20">
        <Navbar />
      </div>
      <div className="w-screen h-screen flex flex-col items-center">
        <div className="flex w-8/12 flex-col gap-2">
          <p className="text-white">hostels / samarpan hostel </p>
          <div className="flex gap-2 text-primaryColor text-2xl">
            <IoMdStar />
            <IoMdStar />
            <IoMdStar />
            <IoIosStarOutline />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-2xl  text-white">Samarpan Hostel</h2>
            <p className="text-gray-500">Ekantakuna, Lalitpur</p>
          </div>

          <div className=" flex w-full  justify-between gap-4">
            <div className="w-8/12   flex justify-start">
              <img src={hostelImage} alt="" className=" h-full w-full" />
            </div>
            <div className=" w-4/12 flex">
              <div className="bg-boxColor h-fit  w-full flex flex-col gap-6 p-8 rounded-lg">
                <div className="flex">
                  <div className="flex flex-col items-start gap-1.5  w-6/12 text-white ">
                    <p className="text-white">Price Starts At</p>
                    <p className="">
                      Rs <b>9000 </b> <span className="text-xs">per month</span>
                    </p>
                    <p>Quick Booking</p>
                  </div>
                  <div className="text-white w-6/12 flex flex-col items-end gap-1.5">
                    <p>14 x Rooms</p>
                    <p>50 x Students</p>
                    <p>9844623996</p>
                  </div>
                </div>
                <button className="bg-primaryColor rounded-lg h-fit py-3 text-white font-medium">
                  View More Options
                </button>
              </div>
              <img src="" alt="" />
            </div>
          </div>
          <div></div>
          <p className="text-white">
            Samarpan Hostel is a cozy and well-maintained hostel located in the
            tranquil area of Ekantakuna, Lalitpur. It offers comfortable
            accommodations with essential amenities, making it an ideal choice
            for students and professionals seeking a peaceful living
            environment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSingleRoom;
