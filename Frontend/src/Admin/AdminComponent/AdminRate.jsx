import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const AdminRate = () => {
  const [rateData, setRateData] = useState([]);
  const [openEdit, setEdit] = useState(false);
  const [editableData, setEditableData] = useState({
    type: "",
    deals: "",
    CancelPolicy: "",
    DealPrice: "",
    Rate: "",
    Availability: "",
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      const response = await axios.get("http://localhost:3000/rate");
      const data = response.data;
      setRateData(data);
    };

    fetchRoomData();
  }, []);

  const handleEditRoomData = (rate) => {
    setEdit(true);
    setEditableData(rate);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addNewRoom = async (e) => {
    e.preventDefault();
    if (editableData.id) {
      // Update existing rate
      await axios.put(
        `http://localhost:3000/rate/${editableData.id}`,
        editableData
      );
    } else {
      // Add new rate
      await axios.post("http://localhost:3000/rate", editableData);
    }
    setEdit(false);
    // Refresh rate data
    const response = await axios.get("http://localhost:3000/rate");
    setRateData(response.data);
  };

  return (
    <div className={`w-full flex flex-col gap-3 relative`}>
      <h1 className="w-full text-[#636363] font-medium">Rate</h1>
      <div
        onClick={() => {
          setEdit(true);
          setEditableData({
            type: "",
            deals: "",
            CancelPolicy: "",
            DealPrice: "",
            Rate: "",
            Availability: "",
          });
        }}
        className="w-full flex justify-end px-4"
      >
        <button className="bg-blue-500 text-white font-medium rounded-md px-3 py-1 active:scale-95 transition-all ease-in-out">
          Add Rate
        </button>
      </div>

      <div className="w-full flex flex-col gap-3 justify-center items-center border-[1px] border-blue-100 rounded-md">
        <table className="w-full bg-blue-50">
          <thead>
            <tr>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Room type
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Deals
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Cancellation Policy
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Deal Price
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Rate
              </th>
              <th className="font-medium text-left pl-4 py-2 text-[#636363]">
                Availability
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rateData?.map((rate, index) => (
              <tr key={index} className="border-[1px] border-blue-100 relative">
                <td className="p-5 font-medium w-[15%]">{rate.type}</td>
                <td className="p-5 font-medium w-[15%] text-[#636363]">
                  {rate.deals}
                </td>
                <td className="p-5 font-medium w-[20%] text-[#636363]">
                  {rate.CancelPolicy}
                </td>
                <td className="p-5 font-medium w-[12%] text-[#636363]">
                  $ {rate.Rate}
                </td>
                <td className="p-5 font-medium w-[10%]">$ {rate.Rate}</td>
                <td className="p-5 font-medium w-[18%]">
                  <span
                    className={`${
                      parseInt(rate.Availability) <= 5
                        ? "bg-orange-100 text-orange-500 px-3 py-1 rounded-xl"
                        : "bg-blue-100 text-blue-500 rounded-xl px-4 py-1"
                    }`}
                  >
                    {parseInt(rate.Availability) === 0
                      ? "Full"
                      : `${rate.Availability} rooms`}
                  </span>
                </td>
                <td className="py-8 font-medium flex gap-4 items-center justify-center h-full">
                  <CiEdit
                    onClick={() => handleEditRoomData(rate)}
                    className="w-6 h-6 cursor-pointer"
                  />
                  <MdDeleteOutline className="w-6 h-6 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to edit and add rate */}
      {openEdit && (
        <div className="w-full absolute top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex justify-center items-center">
          <div className="w-full max-w-[500px] flex flex-col bg-white mx-auto py-5 px-10 border-[2px] rounded-md">
            <div className="w-full flex justify-between items-center">
              <span className="font-semibold text-xl mb-4 text-blue-500">
                {editableData.id ? "Edit rate details" : "Add a new rate"}
              </span>
              <RxCross2 onClick={() => setEdit(false)} className="w-6 h-6" />
            </div>

            <form onSubmit={addNewRoom} className="w-full flex flex-col gap-3">
              <label className="font-medium" htmlFor="type">
                Room Type
              </label>
              <input
                onChange={handleChange}
                className="w-full py-2 outline-none border-[1px] rounded-md px-2"
                name="type"
                id="type"
                placeholder="Enter room type"
                value={editableData.type}
              />

              <label className="font-medium" htmlFor="CancelPolicy">
                Cancellation policy
              </label>
              <input
                onChange={handleChange}
                className="w-full py-2 outline-none border-[1px] rounded-md px-2"
                name="CancelPolicy"
                id="CancelPolicy"
                placeholder="Enter Cancellation Policy"
                value={editableData.CancelPolicy}
              />

              <label className="font-medium" htmlFor="Availability">
                Rooms
              </label>
              <input
                onChange={handleChange}
                required
                type="text"
                value={editableData.Availability}
                name="Availability"
                placeholder="Enter numbers of room"
                className="outline-none p-2 border-[1px] rounded-md"
              />

              <label className="font-medium" htmlFor="Rate">
                Price
              </label>
              <input
                onChange={handleChange}
                className="w-full py-2 outline-none border-[1px] rounded-md px-2"
                name="Rate"
                id="Rate"
                placeholder="Enter room price"
                value={editableData.Rate}
              />

              <button className="px-3 py-2 bg-blue-500 text-white rounded-md mt-5 mx-10 font-medium active:scale-95 transition-all duration-150">
                {editableData.id ? "Update room" : "Add room"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRate;
