import React from "react";

const AddHostel = ({ props, setModel }) => {
  const addNewRoom = (e) => {
    e.preventDefault();
    console.log("New Room added !");
    setTimeout(() => {
      setModel(false);
    }, 200);
  };
  return (
    <div className="w-full absolute top-0 h-screen left-0 right-0 backdrop-blur-sm flex justify-center items-center ">
      <div className="w-full max-w-screen-sm flex flex-col bg-white mx-auto py-5 px-10 border-[2px] rounded-md">
        <h1 className="w-full font-semibold text-xl mb-4 text-blue-500">
          Add a new room
        </h1>
        <form
          onSubmit={addNewRoom}
          className="w-full flex flex-col gap-3"
          action=""
        >
          <label className="font-medium" htmlFor="">
            Room Type
          </label>
          <select
            className="w-full py-2 outline-none border-[1px] rounded-md"
            name="RoomType"
            id="roomType"
          >
            <option value="Double Bed">Double Bed</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Suite">Suite</option>
          </select>

          <label className="font-medium" htmlFor="">
            Floor
          </label>
          <select
            className="w-full py-2 outline-none border-[1px] rounded-md"
            name="floor"
            id="floor"
          >
            <option value="Floor - 1">Floor 1</option>
            <option value="Floor - 2">Floor 2</option>
            <option value="Floor - 3">Floor 3</option>
          </select>

          <label className="font-medium" htmlFor="">
            Amenities
          </label>
          <input
            required
            type="text"
            value="sagar"
            name="saagr"
            placeholder="Enter the facilities here"
            className="outline-none p-2 border-[1px] rounded-md"
          />

          <label className="font-medium" htmlFor="">
            Status
          </label>
          <select
            className="w-full py-2 outline-none border-[1px] rounded-md"
            name="status"
            id="status"
          >
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Reserved">Reserved</option>
          </select>

          <button className="px-3 py-2 bg-blue-500 text-white rounded-md mt-5 mx-10 font-medium active:scale-95 transition-all duration-150 ">
            Add room
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHostel;
