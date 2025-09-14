import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";

const CreateUserByAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        "/api/admin/createNewUser",
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("User created successfully!");
      navigate("/admin/users");
    } catch (error) {
      toast.error("Failed to create user");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-10 bg-base-100 p-6 sm:p-8 rounded-lg shadow-lg text-grey">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Create New User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-base-200 text-gray placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-base-200 text-gray placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-base-200 text-gray placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2 text-sm font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-base-200 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="user" className="text-black">
              User
            </option>
            <option value="admin" className="text-black">
              Admin
            </option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded w-full transition duration-200 font-medium"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUserByAdmin;
