import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const AdminStudents = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    packageId: "",
  });

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/membership/getMembership`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMemberships(
        Array.isArray(response.data.memberships)
          ? response.data.memberships
          : [response.data.membership]
      );
      setError("");
    } catch (err) {
      console.error("Failed to fetch memberships:", err);
      setError("Failed to fetch membership information");
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/students/addStudent`, newStudent, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setShowAddStudentModal(false);
      setNewStudent({ name: "", email: "", packageId: "" });
      fetchMemberships();
    } catch (err) {
      console.error("Failed to add student:", err);
      setError("Failed to add student");
    }
  };

  const sortedMemberships = [...memberships].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredMemberships = sortedMemberships.filter(
    (membership) => filterStatus === "all" || membership.status === filterStatus
  );

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Membership Management</h1>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="statusFilter" className="mr-2">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
        <button
          onClick={() => setShowAddStudentModal(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Student
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="px-4 py-2 border-b cursor-pointer"
                onClick={() => handleSort("package.name")}
              >
                Package Name{" "}
                {sortField === "package.name" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-2 border-b cursor-pointer"
                onClick={() => handleSort("startDate")}
              >
                Start Date{" "}
                {sortField === "startDate" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-2 border-b cursor-pointer"
                onClick={() => handleSort("endDate")}
              >
                End Date{" "}
                {sortField === "endDate" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                className="px-4 py-2 border-b cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortField === "status" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-2 border-b">Package Price</th>
              <th className="px-4 py-2 border-b">Package Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredMemberships.map((membership, index) => (
              <tr
                key={membership.id || index}
                className={index % 2 === 0 ? "bg-gray-50" : ""}
              >
                <td className="px-4 py-2 border-b">
                  {membership.package.name}
                </td>
                <td className="px-4 py-2 border-b">
                  {formatDate(membership.startDate)}
                </td>
                <td className="px-4 py-2 border-b">
                  {formatDate(membership.endDate)}
                </td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded ${
                      membership.status === "ACTIVE"
                        ? "bg-green-200 text-green-800"
                        : membership.status === "INACTIVE"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {membership.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  ${membership.package.price}
                </td>
                <td className="px-4 py-2 border-b">
                  {membership.package.duration} days
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddStudentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Add New Student</h3>
            <form onSubmit={handleAddStudent}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="packageId"
                >
                  Package
                </label>
                <select
                  id="packageId"
                  value={newStudent.packageId}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, packageId: e.target.value })
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a package</option>
                  {/* Assuming you have a list of packages available */}
                  {memberships.map((membership) => (
                    <option
                      key={membership.package.id}
                      value={membership.package.id}
                    >
                      {membership.package.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
