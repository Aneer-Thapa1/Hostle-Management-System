import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const AddHostel = ({ setModel, editData }) => {
  const [roomData, setRoomData] = useState({
    type: "Double Bed",
    floor: "Floor 1",
    amenities: "",
    status: "Available",
    capacity: "",
    description: "",
  });

  //Function to send data to backend

  const sendDataToBackend = async () => {
    const response = await axios.post("http://localhost:3000/rooms", roomData);
    console.log(response);
    if (response.status === 201) {
      console.log("Room added successfully!!");
    }
  };

  const sendEditedDataToBackend = async () => {
    const response = await axios.put(
      `http://localhost:3000/rooms/${roomData.id}`,
      roomData
    );
    console.log(response);
    if (response.status === 201) {
      console.log("Room updated successfully!!");
    }
  };

  useEffect(() => {
    if (editData != "") {
      setRoomData(editData);
    }
  }, [editData]);

  const addNewRoom = (e) => {
    e.preventDefault();
    //send to backend
    {
      editData === "" ? sendDataToBackend() : sendEditedDataToBackend();
    }

    setTimeout(() => {
      setModel(false);
    }, 200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
    // console.log(roomData);
  };

  return (
    <div className="w-full absolute top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex justify-center items-center">
      <div className="w-full max-w-[500px] flex flex-col bg-white mx-auto py-5 px-10 border-[2px] rounded-md">
        <div className="w-full flex justify-between items-center">
          <span className=" font-semibold text-xl mb-4 text-blue-500">
            {editData === "" ? "Add a new room" : "Edit room details"}
          </span>
          <RxCross2 onClick={() => setModel(false)} className="w-6 h-6" />
        </div>

        <form
          onSubmit={addNewRoom}
          className="w-full flex flex-col gap-3"
          action=""
        >
          <div className="w-full flex justify-between gap-10">
            <div className="w-full flex flex-col gap-3">
              <label className="font-medium" htmlFor="">
                Room Type
              </label>
              <select
                onChange={(e) => handleChange(e)}
                className="w-full py-2 outline-none border-[1px] rounded-md"
                name="type"
                id="type"
                value={roomData.type}
              >
                <option value="Double Bed">Double Bed</option>
                <option value="Single Bed">Single Bed</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-3">
              <label className="font-medium" htmlFor="">
                Floor
              </label>
              <select
                onChange={(e) => handleChange(e)}
                className="w-full py-2 outline-none border-[1px] rounded-md"
                name="floor"
                id="floor"
                value={roomData.floor}
              >
                <option value="Floor - 1">Floor 1</option>
                <option value="Floor - 2">Floor 2</option>
                <option value="Floor - 3">Floor 3</option>
              </select>
            </div>
          </div>

          <label className="font-medium" htmlFor="">
            Amenities
          </label>
          <input
            onChange={(e) => handleChange(e)}
            required
            type="text"
            value={roomData.amenities}
            name="amenities"
            placeholder="Enter the facilities here"
            className="outline-none p-2 border-[1px] rounded-md"
          />

          <label className="font-medium" htmlFor="">
            Description
          </label>
          <textarea
            onChange={(e) => handleChange(e)}
            required
            type="text"
            value={roomData.description}
            name="description"
            placeholder="Enter description of room"
            className="outline-none p-2 border-[1px] rounded-md"
          />

          <div className="w-full flex justify-between gap-10">
            <div className="w-full flex flex-col gap-3">
              <label className="font-medium" htmlFor="">
                Capacity
              </label>
              <input
                onChange={(e) => handleChange(e)}
                required
                type="number"
                value={roomData.capacity}
                name="capacity"
                placeholder="Enter room capacity"
                className="outline-none p-2 border-[1px] rounded-md"
              />
            </div>
            <div className="w-full flex flex-col gap-3">
              <label className="font-medium" htmlFor="">
                Status
              </label>
              <select
                onChange={(e) => handleChange(e)}
                className="w-full py-2 outline-none border-[1px] rounded-md"
                name="status"
                id="status"
                value={roomData.status}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>

          <button className="px-3 py-2 bg-blue-500 text-white rounded-md mt-5 mx-10 font-medium active:scale-95 transition-all duration-150 ">
            {editData === "" ? "Add room" : "Update room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHostel;
