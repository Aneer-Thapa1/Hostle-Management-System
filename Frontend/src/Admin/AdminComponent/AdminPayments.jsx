import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8870/api/payment";

const axiosAuth = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const PaymentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  editingPayment,
}) => {
  const [payment, setPayment] = useState({
    userId: "",
    amount: "",
    paymentDate: "",
    paymentMethod: "CREDIT_CARD",
    status: "COMPLETED",
  });

  useEffect(() => {
    if (editingPayment) {
      setPayment(editingPayment);
    }
  }, [editingPayment]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(payment);
    setPayment({
      userId: "",
      amount: "",
      paymentDate: "",
      paymentMethod: "CREDIT_CARD",
      status: "COMPLETED",
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">
          {editingPayment ? "Edit Payment" : "Add New Payment"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={payment.userId}
            onChange={(e) => setPayment({ ...payment, userId: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={payment.amount}
            onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            value={payment.paymentDate}
            onChange={(e) =>
              setPayment({ ...payment, paymentDate: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={payment.paymentMethod}
            onChange={(e) =>
              setPayment({ ...payment, paymentMethod: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
            <option value="MOBILE_PAYMENT">Mobile Payment</option>
          </select>
          <select
            value={payment.status}
            onChange={(e) => setPayment({ ...payment, status: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editingPayment ? "Update Payment" : "Add Payment"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axiosAuth.get("/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch payments. Please try again.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axiosAuth.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again.");
    }
  };

  const handleAddPayment = async (newPayment) => {
    try {
      const response = await axiosAuth.post("/payments", newPayment);
      setPayments([...payments, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding payment:", error);
      setError("Failed to add payment. Please try again.");
    }
  };

  const handleEditPayment = async (updatedPayment) => {
    try {
      const response = await axiosAuth.put(
        `/payments/${updatedPayment.id}`,
        updatedPayment
      );
      setPayments(
        payments.map((p) => (p.id === updatedPayment.id ? response.data : p))
      );
      setIsModalOpen(false);
      setEditingPayment(null);
    } catch (error) {
      console.error("Error updating payment:", error);
      setError("Failed to update payment. Please try again.");
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Payment Management</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Payment
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Student Name</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Payment Method</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment) => (
              <tr key={payment.id} className="border-t">
                <td className="px-4 py-2">{payment.studentName}</td>
                <td className="px-4 py-2">${payment.amount}</td>
                <td className="px-4 py-2">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{payment.paymentMethod}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      payment.status === "COMPLETED"
                        ? "bg-green-200 text-green-800"
                        : payment.status === "PENDING"
                        ? "bg-yellow-200 text-yellow-800"
                        : payment.status === "FAILED"
                        ? "bg-red-200 text-red-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setEditingPayment(payment);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        {Array.from(
          { length: Math.ceil(filteredPayments.length / paymentsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      <PaymentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPayment(null);
        }}
        onSubmit={editingPayment ? handleEditPayment : handleAddPayment}
        students={students}
        editingPayment={editingPayment}
      />
    </div>
  );
};

export default AdminPayments;
