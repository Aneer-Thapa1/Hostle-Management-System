import React from "react";

const AdminRoom = () => {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* optioons */}
      <div className="options"></div>

      <div className="w-full flex flex-col gap-3 justify-center items-center border-[1px] border-[#c1c1c1] rounded-sm">
        <table className="w-full bg-blue-50">
          <thead>
            <tr>
              <th className="font-normal text-left pl-4 py-2">Room number</th>
              <th className="font-normal text-left pl-4 py-2">Bed type</th>
              <th className="font-normal text-left pl-4 py-2">Room floor</th>
              <th className="font-normal text-left pl-4 py-2">Room facility</th>
              <th className="font-normal text-left pl-4 py-2">Status</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default AdminRoom;
