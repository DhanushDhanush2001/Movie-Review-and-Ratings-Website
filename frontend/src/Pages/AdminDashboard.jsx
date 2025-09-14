import React, { useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../axios/axiosInstance";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalReviews: 0,
  });
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
         // Fetch dashboard statistics from backend API
    axiosInstance
    .get("api/adminDash/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setStats(response.data.data);
      // console.log("data----------->",response.data.data);
      
    })
    .catch((error) => {
      console.error("Error fetching dashboard stats:", error);
    });
      } catch (error) {
        console.error("❌ Error fetching Admin data:", error.message);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-medium">Total Users</h3>
          <p className="text-3xl">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-medium">Total Movies</h3>
          <p className="text-3xl">{stats.totalMovies}</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-medium">Total Reviews</h3>
          <p className="text-3xl">{stats.totalReviews}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
