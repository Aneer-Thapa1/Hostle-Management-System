import { useState } from "react";
import Navbar from "../components/Navbar";
import { IoIosStarOutline } from "react-icons/io";
import { IoMdStar } from "react-icons/io";
import hostelImage from "../assets/aboutImage1.svg";

function HostelInfo() {
  return <div>Hostel Information Content</div>;
}

function PackageSummary() {
  return <div>Package Summary Content</div>;
}

function FacilitiesActivities() {
  return <div>Facilities & Activities Content</div>;
}

function Gallery() {
  return <div>Gallery Content</div>;
}

function Meals() {
  return <div>Meals Content</div>;
}

const UserSingleRoom = () => {
  const renderComponent = () => {
    switch (selectedOption) {
      case "Hostel Information":
        return <HostelInfo />;
      case "Package Summary":
        return <PackageSummary />;
      case "Facilities & Activities":
        return <FacilitiesActivities />;
      case "Gallery":
        return <Gallery />;
      case "Meals":
        return <Meals />;
      default:
        return <HostelInfo />;
    }
  };

  const [selectedOption, setSelectedOption] = useState("Hostel Information");
  return (
    <div className="bg-background w-screen  flex flex-col gap-8">
      <div className="abslute top-0 left-0 z-20">
        <Navbar />
      </div>
      <div className="w-screen h-screen flex flex-col items-center gap-10 mt-9">
        <div className="flex w-8/12 flex-col gap-4">
          <p className="text-white">hostels / samarpan hostel </p>
          <div className="flex gap-2 text-primaryColor text-2xl">
            <IoMdStar />
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
              <img
                src={hostelImage}
                alt=""
                className=" h-full w-full rounded-lg"
              />
            </div>
            <div className=" w-4/12 flex flex-col gap-4 ">
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

              <div className="w-full bg-red-400 h-full rounded-lg"></div>
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

        <div className="flex w-8/12 h-screen flex-col gap-6">
          <div className="flex gap-12 text-white">
            <p
              className={`flex gap-4  cursor-pointer pb-2 ${
                selectedOption === "Hostel Information"
                  ? "border-b-2 border-primaryColor text-primaryColor"
                  : ""
              }`}
              onClick={() => setSelectedOption("Hostel Information")}
            >
              Hostel Information
            </p>
            <p
              className={`flex gap-4  cursor-pointer pb-2 ${
                selectedOption === "Package Summary"
                  ? "border-b-2 border-primaryColor text-primaryColor"
                  : ""
              }`}
              onClick={() => setSelectedOption("Package Summary")}
            >
              Package Summary
            </p>
            <p
              className={`flex gap-4  cursor-pointer pb-2 ${
                selectedOption === "Facilities & Activities"
                  ? "border-b-2 border-primaryColor text-primaryColor"
                  : ""
              }`}
              onClick={() => setSelectedOption("Facilities & Activities")}
            >
              Facilities & Activities
            </p>
            <p
              className={`flex gap-4  cursor-pointer pb-2 ${
                selectedOption === "Gallery"
                  ? "border-b-2 border-primaryColor text-primaryColor"
                  : ""
              }`}
              onClick={() => setSelectedOption("Gallery")}
            >
              Gallery
            </p>
            <p
              className={`flex gap-4  cursor-pointer pb-2 ${
                selectedOption === "Meals"
                  ? "border-b-2 border-primaryColor text-primaryColor"
                  : ""
              }`}
              onClick={() => setSelectedOption("Meals")}
            >
              Meals
            </p>
          </div>
          <div>{renderComponent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserSingleRoom;
