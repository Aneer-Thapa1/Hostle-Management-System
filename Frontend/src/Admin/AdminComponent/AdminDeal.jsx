import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const AdminDeal = () => {
  // const [dealData, setDealData] = useState([]);
  // const [openEdit, setEdit] = useState(false);
  // const [editableData, setEditableData] = useState({
  //   type: "",
  //   deals: "",
  //   CancelPolicy: "",
  //   DealPrice: "",
  //   Rate: "",
  //   Availability: "",
  // });
  // useEffect(() => {
  //   const fetchDealData = async () => {
  //     const response = await axios.get("http://localhost:3000/deal");
  //     const data = response.data;
  //     setDealData(data);
  //   };
  //   fetchDealData();
  // }, []);
  // const handleEditDealData = (deal) => {
  //   setEdit(true);
  //   setEditableData(deal);
  // };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditableData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  // const addNewDeal = async (e) => {
  //   e.preventDefault();
  //   if (editableData.id) {
  //     // Update existing rate
  //     await axios.put(
  //       `http://localhost:3000/deal/${editableData.id}`,
  //       editableData
  //     );
  //   } else {
  //     // Add new rate
  //     await axios.post("http://localhost:3000/deal", editableData);
  //   }
  //   setEdit(false);
  //   // Refresh rate data
  //   const response = await axios.get("http://localhost:3000/deal");
  //   setDealData(response.data);
  // };
  // return (
  //   <div className={`w-full flex flex-col gap-3 relative`}>
  //     <h1 className="w-full text-[#636363] font-medium">Deal</h1>
  //     <div
  //       onClick={() => {
  //         setEdit(true);
  //         setEditableData({
  //           type: "",
  //           deals: "",
  //           CancelPolicy: "",
  //           DealPrice: "",
  //           Rate: "",
  //           Availability: "",
  //         });
  //       }}
  //       className="w-full flex justify-end px-4"
  //     >
  //       <button className="bg-blue-500 text-white font-medium rounded-md px-3 py-1 active:scale-95 transition-all ease-in-out">
  //         Add Deal
  //       </button>
  //     </div>
  //     <div className="w-full flex flex-col gap-3 justify-center items-center border-[1px] border-blue-100 rounded-md">
  //       <table className="w-full bg-blue-50">
  //         <thead>
  //           <tr>
  //             <th className="font-medium text-left pl-4 py-2 text-[#636363]">
  //               Reference Number
  //             </th>
  //             <th className="font-medium text-left pl-4 py-2 text-[#636363]">
  //               Deal Name
  //             </th>
  //             <th className="font-medium text-left pl-4 py-2 text-[#636363]">
  //               Reservation Left
  //             </th>
  //             <th className="font-medium text-left pl-4 py-2 text-[#636363]">
  //               End Date
  //             </th>
  //             <th className="font-medium text-left pl-4 py-2 text-[#636363]">
  //               Rate
  //             </th>
  //             <th className="font-medium text-left pl-4 py-2 text-[#636363]">
  //               Room type
  //             </th>
  //             <th className="font-medium text-left pl-4 py-2 text-[#636363]">
  //               Status
  //             </th>
  //           </tr>
  //         </thead>
  //         {/* <tbody className="bg-white">
  //           {dealData?.map((rate, index) => (
  //             <tr key={index} className="border-[1px] border-blue-100 relative">
  //               <td className="p-5 font-medium w-[15%]">{rate.type}</td>
  //               <td className="p-5 font-medium w-[15%] text-[#636363]">
  //                 {rate.deals}
  //               </td>
  //               <td className="p-5 font-medium w-[20%] text-[#636363]">
  //                 {rate.CancelPolicy}
  //               </td>
  //               <td className="p-5 font-medium w-[12%] text-[#636363]">
  //                 $ {rate.DealPrice}
  //               </td>
  //               <td className="p-5 font-medium w-[10%]">$ {rate.Rate}</td>
  //               <td className="p-5 font-medium w-[18%]">
  //                 <span
  //                   className={`${
  //                     parseInt(rate.Availability) <= 5
  //                       ? "bg-orange-100 text-orange-500 px-3 py-1 rounded-xl"
  //                       : "bg-blue-100 text-blue-500 rounded-xl px-4 py-1"
  //                   }`}
  //                 >
  //                   {parseInt(rate.Availability) === 0
  //                     ? "Full"
  //                     : `${rate.Availability} rooms`}
  //                 </span>
  //               </td>
  //               <td className="py-8 font-medium flex gap-4 items-center justify-center h-full">
  //                 <CiEdit
  //                   onClick={() => handleEditRoomData(rate)}
  //                   className="w-6 h-6 cursor-pointer"
  //                 />
  //                 <MdDeleteOutline className="w-6 h-6 cursor-pointer" />
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody> */}
  //       </table>
  //     </div>
  //   </div>
  // );
};

export default AdminDeal;
