import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const AdminStudent = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomNumber: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/students`);
      setStudents(response.data);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${apiUrl}/api/students/${selectedStudent.id}`,
          formData
        );
      } else {
        await axios.post(`${apiUrl}/api/students`, formData);
      }
      fetchStudents();
      resetForm();
      setShowPopup(false);
    } catch (err) {
      setError(
        isEditing ? "Failed to update student" : "Failed to add student"
      );
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData(student);
    setIsEditing(true);
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${apiUrl}/api/students/${id}`);
        fetchStudents();
      } catch (err) {
        setError("Failed to delete student");
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", roomNumber: "" });
    setSelectedStudent(null);
    setIsEditing(false);
  };

  const openPopup = () => {
    resetForm();
    setShowPopup(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={openPopup}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Student
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Student" : "Add New Student"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  placeholder="Room Number"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Student List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-100">Name</th>
              <th className="px-4 py-2 bg-gray-100">Email</th>
              <th className="px-4 py-2 bg-gray-100">Phone</th>
              <th className="px-4 py-2 bg-gray-100">Room Number</th>
              <th className="px-4 py-2 bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.email}</td>
                <td className="border px-4 py-2">{student.phone}</td>
                <td className="border px-4 py-2">{student.roomNumber}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudent;
