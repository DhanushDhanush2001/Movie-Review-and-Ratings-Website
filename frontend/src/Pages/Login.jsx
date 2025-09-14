import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";  // ✅ Add toast

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/user/login", formData);
      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);
        toast.success("Login Successful!");

        setTimeout(() => {
          if (decoded.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/User-Home");
          }
        }, 1000); // Delay navigation to let the toast show
      } else {
        toast.error("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Login Error:", error.message);
      toast.error("❌ Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-white text-white flex items-center justify-center min-h-screen p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-cyan-400 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-cyan-200">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-cyan-200">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded text-white font-semibold transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
