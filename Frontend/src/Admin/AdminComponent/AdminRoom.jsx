import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import AddHostel from "./ComponentModels/AddHostel";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const AdminRoom = ({ setModel, setEditData }) => {
  const [allData, setAllData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [selectedOptions, setOption] = useState("allRoom");
  const [openEdit, setEdit] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchRoomData = async () => {
      const response = await axios.get("http://localhost:3000/rooms");
      // console.table(response.data);
      const data = response.data;

      // setRoomData(response.data);
      setAllData(data);
      setRoomData(data.splice(0, 5));
    };

    fetchRoomData();
  }, []);

  // Pagination

  useEffect(() => {}, [page]);

  const openAddForm = () => {
    setTimeout(() => {
      setModel(true);
    }, 150);
  };

  const showEditOptions = () => {
    setEdit(true);
  };

  const EditRoomData = (room) => {
    setEditData(room);
    setModel(true);
  };

  return (
    <div className={`w-full flex flex-col gap-3 relative `}>
      <h1 className="w-full text-[#636363] font-medium">Rooms</h1>
      {/* options */}
      <div className="options w-full flex gap-3 my-3 text-sm">
        <div className="w-[70%] flex gap-3">
          <div
            onClick={() => setOption("allRoom")}
            className={`px-3 py-2 flex gap-1 ${
              selectedOptions === "allRoom"
                ? "border-[1px] border-blue-500 bg-blue-100 text-blue-500"
                : "border-[1px]  border-[#636363] text-[#636363]"
            } rounded-full font-medium cursor-pointer active:scale-90 transition-bg duration-300`}
          >
            <span>All rooms</span>
            <span>({roomData?.length})</span>
          </div>

          <div
            onClick={() => setOption("availableRoom")}
            className={`px-3 py-2 flex gap-1 ${
              selectedOptions === "availableRoom"
                ? "border-[1px] border-blue-500 bg-blue-100 text-blue-500"
                : "border-[1px]  border-[#636363] text-[#636363]"
            } rounded-full font-medium cursor-pointer active:scale-90 transition-bg duration-300`}
          >
            <span>Available rooms</span>
            <span>
              ({roomData?.filter((room) => room.status === "Available").length})
            </span>
          </div>

          <div
            onClick={() => setOption("BookedRoom")}
            className={`px-3 py-2 flex gap-1 ${
              selectedOptions === "BookedRoom"
                ? "border-[1px] border-blue-500 bg-blue-100 text-blue-500"
                : "border-[1px]  border-[#636363] text-[#636363]"
            } rounded-full font-medium cursor-pointer active:scale-90 transition-bg duration-300`}
          >
            <span>Booked rooms</span>
            <span>
              ({roomData?.filter((room) => room.status === "Booked").length})
            </span>
          </div>
        </div>

        {/* ADD ROOM BUTTON */}
        <div onClick={openAddForm} className="w-[30%] flex justify-end px-4">
          <button className="bg-blue-500 text-white font-medium rounded-md px-3 py-1 active:scale-95 transition-all ease-in-out">
            Add Room
          </button>
        </div>
      </div>

      {/* TABLE  */}

      <div className="w-full flex flex-col gap-3 justify-center items-center border-[1px] border-blue-100 rounded-md">
        <table className="w-full bg-blue-50">
          <thead>
            <tr>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Room number
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Bed type
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Room floor
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Room facility
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {selectedOptions === "allRoom"
              ? roomData?.map((room, index) => {
                  return (
                    <>
                      <tr
                        key={index}
                        className="border-[1px] border-blue-100 relative"
                      >
                        <td className="p-5 font-medium w-[15%] ">
                          {room.roomId}
                        </td>
                        <td className="p-5 font-medium w-[15%] text-[#636363]">
                          {room.type}
                        </td>
                        <td className="p-5 font-medium w-[15%] text-[#636363]">
                          {room.floor}
                        </td>
                        <td className="p-5 font-medium w-[25%] text-[#636363]">
                          {room.amenities}
                        </td>
                        <td className={`p-5 font-medium w-[20%]`}>
                          <span
                            className={`${
                              room.status === "Available"
                                ? "bg-blue-100 text-blue-500 px-3 py-1 rounded-xl"
                                : room.status === "Reserved"
                                ? "bg-green-100 text-green-500 rounded-xl px-4 py-1"
                                : "bg-orange-100 text-orange-500 rounded-xl px-4 py-1"
                            }`}
                          >
                            {room.status}
                          </span>
                        </td>
                        <td className="py-8 font-medium flex gap-4 items-center justify-center h-full">
                          <CiEdit
                            onClick={() => EditRoomData(room)}
                            className="w-6 h-6 cursor-pointer"
                          />
                          <MdDeleteOutline className="w-6 h-6 cursor-pointer" />
                        </td>
                      </tr>
                    </>
                  );
                })
              : selectedOptions === "availableRoom"
              ? roomData
                  .filter((room) => room.status === "Available")
                  ?.map((room, index) => {
                    return (
                      <>
                        <tr
                          key={index}
                          className="border-[1px] border-blue-100 "
                        >
                          <td className="p-5 font-medium w-[15%] ">
                            {room.roomId}
                          </td>
                          <td className="p-5 font-medium w-[15%] text-[#636363]">
                            {room.type}
                          </td>
                          <td className="p-5 font-medium w-[15%] text-[#636363]">
                            {room.floor}
                          </td>
                          <td className="p-5 font-medium w-[25%] text-[#636363]">
                            {room.amenities}
                          </td>
                          <td className={`p-5 font-medium w-[20%] `}>
                            <span
                              className={`${
                                room.status === "Available"
                                  ? "bg-blue-100 text-blue-500 px-3 py-1 rounded-xl"
                                  : room.status === "Reserved"
                                  ? "bg-green-100 text-green-500 rounded-xl px-4 py-1"
                                  : "bg-orange-100 text-orange-500 rounded-xl px-4 py-1"
                              }`}
                            >
                              {room.status}
                            </span>
                          </td>
                          <td className="py-8 font-medium flex gap-4 items-center justify-center h-full">
                            <CiEdit
                              onClick={() => EditRoomData(room)}
                              className="w-6 h-6 cursor-pointer"
                            />
                            <MdDeleteOutline className="w-6 h-6 cursor-pointer" />
                          </td>
                        </tr>
                      </>
                    );
                  })
              : roomData
                  .filter((room) => room.status === "Booked")
                  ?.map((room, index) => {
                    return (
                      <>
                        <tr
                          key={index}
                          className="border-[1px] border-blue-100 "
                        >
                          <td className="p-5 font-medium w-[15%] ">
                            {room.roomId}
                          </td>
                          <td className="p-5 font-medium w-[15%] text-[#636363]">
                            {room.type}
                          </td>
                          <td className="p-5 font-medium w-[15%] text-[#636363]">
                            {room.floor}
                          </td>
                          <td className="p-5 font-medium w-[25%] text-[#636363]">
                            {room.amenities}
                          </td>
                          <td className={`p-5 font-medium w-[20%] `}>
                            <span
                              className={`${
                                room.status === "Available"
                                  ? "bg-blue-100 text-blue-500 px-3 py-1 rounded-xl"
                                  : room.status === "Reserved"
                                  ? "bg-green-100 text-green-500 rounded-xl px-4 py-1"
                                  : "bg-orange-100 text-orange-500 rounded-xl px-4 py-1"
                              }`}
                            >
                              {room.status}
                            </span>
                          </td>
                          <td className="py-8 font-medium flex gap-4 items-center justify-center h-full">
                            <CiEdit
                              onClick={() => EditRoomData(room)}
                              className="w-6 h-6 cursor-pointer"
                            />
                            <MdDeleteOutline className="w-6 h-6 cursor-pointer" />
                          </td>
                        </tr>
                      </>
                    );
                  })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRoom;
