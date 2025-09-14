import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../axios/axiosInstance";

const UserEdit = () => {
  const { id } = useParams(); // id = userId from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/getUserById/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const user = response.data.user;
        setFormData({ name: user.name, email: user.email, role: user.role });
      } catch (error) {
        toast.error("Failed to fetch user details");
        console.error(error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/admin/updateUserByAdmin/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("User updated successfully");
      navigate("/admin/users"); // after successful update
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-grey mb-6">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="text-gray block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="text-gray block mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="select select-bordered w-full bg-gray-800 text-white"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md shadow transition"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default UserEdit;
