import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";

const AdminRoom = () => {
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    const fetchRoomData = async () => {
      const response = await axios.get("http://localhost:3000/rooms");
      // console.table(response.data);
      setRoomData(response.data);
    };

    fetchRoomData();
  }, []);
  return (
    <div className="w-full flex flex-col gap-3">
      {/* optioons */}
      <div className="options"></div>

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
            {roomData?.map((room, index) => {
              return (
                <>
                  <tr key={index} className="border-[1px] border-blue-100 ">
                    <td className="p-5 font-medium w-[15%] ">{room.roomId}</td>
                    <td className="p-5 font-medium w-[15%] text-[#636363]">
                      {room.type}
                    </td>
                    <td className="p-5 font-medium w-[15%] text-[#636363]">
                      {room.floor}
                    </td>
                    <td className="p-5 font-medium w-[25%] text-[#636363]">
                      {room.amenities}
                    </td>
                    <td className="p-5 font-medium w-[20%] ">{room.status}</td>
                    <td className="p-5 font-medium w-[2%]">
                      <CiMenuKebab />
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
