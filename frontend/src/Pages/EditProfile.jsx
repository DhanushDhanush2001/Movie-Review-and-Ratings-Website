import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { FaCamera } from "react-icons/fa";

function EditProfile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePic: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setUserData({ ...userData, profilePic: e.target.files[0] });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    if (userData.profilePic instanceof File) {
      formData.append("profilePic", userData.profilePic);
    }

    setUploading(true);
    try {
      await axiosInstance.patch("/api/user/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ Profile updated!");
      setTimeout(() => navigate("/UserDashboard"), 1500);
    } catch (error) {
      console.log(error);
      setMessage("❌ Update failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axiosInstance.delete("/api/user/delete", {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem("token");
        navigate("/register");
      } catch (error) {
        console.error("Delete failed:", error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
        {message && (
          <p className="text-center text-green-400 mb-4">{message}</p>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="relative flex justify-center">
            <div className="relative w-32 h-32">
              {/* Profile Image */}
              {userData.profilePic && !(userData.profilePic instanceof File) ? (
                <img
                  src={userData.profilePic}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}

              {/* Camera Button */}
              <button
                type="button"
                onClick={handleCameraClick}
                className="absolute bottom-0 right-0 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200 transition"
                disabled={uploading}
              >
                <FaCamera className="text-gray-700" size={16} />
              </button>

              {/* Hidden Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </div>

          {/* Inputs */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition"
              disabled={uploading}
            >
              {uploading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold transition"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
