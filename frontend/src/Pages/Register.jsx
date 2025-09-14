import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { toast } from "react-toastify";  // ✅ Import toast

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/user/register", formData);

      if (response.data.success) {
        toast.success("✅ Registration Successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1000); // delay for user to see the toast
      } else {
        toast.error("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-cyan-400 text-center">Create an Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 rounded transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
