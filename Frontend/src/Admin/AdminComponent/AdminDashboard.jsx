import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  FaSpinner,
  FaBed,
  FaUsers,
  FaMoneyBillWave,
  FaStar,
  FaChartLine,
  FaPercent,
  FaBoxOpen,
} from "react-icons/fa";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  BarElement
);

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_PATH || "http://localhost:3000";

const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery(
    "enhancedDashboardData",
    fetchDashboardData
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">Error: {error.message}</div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Hostel Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Occupancy"
          value={`${data.overview.totalOccupancy}/${data.overview.totalCapacity}`}
          icon={FaBed}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Total Bookings"
          value={data.overview.totalBookings}
          icon={FaUsers}
          color="bg-green-500"
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${data.overview.totalRevenue.toFixed(2)}`}
          icon={FaMoneyBillWave}
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Average Rating"
          value={data.overview.averageRating.toFixed(1)}
          icon={FaStar}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Revenue Trend" icon={FaChartLine}>
          <RevenueTrendChart data={data.revenue.trend} />
        </ChartCard>
        <ChartCard title="Occupancy Trend" icon={FaPercent}>
          <OccupancyTrendChart data={data.occupancy.trend} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Room Type Occupancy" icon={FaBed}>
          <RoomTypeOccupancyChart data={data.occupancy.byRoomType} />
        </ChartCard>
        <ChartCard title="Top Packages" icon={FaBoxOpen}>
          <TopPackagesChart data={data.topPackages} />
        </ChartCard>
        <ChartCard title="Booking Status" icon={FaUsers}>
          <BookingStatusChart data={data.bookings.byStatus} />
        </ChartCard>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`${color} p-6 rounded-lg shadow-lg text-white transform transition-all duration-300 hover:scale-105`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <Icon className="text-5xl opacity-50" />
    </div>
  </div>
);

const ChartCard = ({ title, children, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <Icon className="mr-2 text-blue-500" />
      {title}
    </h2>
    {children}
  </div>
);

const RevenueTrendChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: "Revenue",
        data: data.map((item) => item.total),
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Daily Revenue" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Revenue ($)" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

const OccupancyTrendChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: "Occupancy",
        data: data.map((item) => item.count),
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Daily Occupancy" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Guests" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

const RoomTypeOccupancyChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.type),
    datasets: [
      {
        label: "Occupied",
        data: data.map((item) => item.occupied),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
      },
      {
        label: "Available",
        data: data.map((item) => item.total - item.occupied),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Room Type Occupancy" },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return <Bar data={chartData} options={options} />;
};

const TopPackagesChart = ({ data }) => {
  const chartData = {
    labels: data.map((pkg) => pkg.packageName),
    datasets: [
      {
        data: data.map((pkg) => pkg.bookings),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Top Packages" },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

const BookingStatusChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.status),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Booking Status" },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default AdminDashboard;
