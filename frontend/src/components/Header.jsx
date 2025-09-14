import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const res = await axiosInstance.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status) {
          setUserData(res.data.user);
          console.log("User Data:", res.data.user);
        }
      } catch (error) {
        console.error("❌ Failed to load profile:", error.message);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Helper to get full profile picture URL
  const getProfilePic = () => {
    if (!userData?.profilePic) return "/default-avatar.png";
    if (userData.profilePic.startsWith("http")) return userData.profilePic;
    return `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}${userData.profilePic}`;
  };

  return (
    <nav className="relative bg-white shadow dark:bg-gray-800">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          {/* App Name */}
          <div className="flex items-center justify-between">
            <h1
              onClick={() => navigate("/")}
              className="text-2xl font-bold text-cyan-500 cursor-pointer"
            >
              CineReviews
            </h1>

            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Menu */}
          <div
            className={`${
              isOpen ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-full"
            } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
          >
            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
              <Link
                to={userData?.role === "admin" ? "/admin/dashboard" : "/"}
                className="px-3 py-2 mx-3 mt-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0"
              >
                Home
              </Link>
              <Link
                to="/movies"
                className="px-3 py-2 mx-3 mt-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0"
              >
                Movies
              </Link>

              {token ? (
                <>
                  <Link
                    to="/watchlist"
                    className="px-3 py-2 mx-3 mt-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0"
                  >
                    Watchlist
                  </Link>
                  {userData?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="px-3 py-2 mx-3 mt-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 mx-3 mt-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 mx-3 mt-2 text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 lg:mt-0"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Profile Avatar */}
            {token && userData && (
              <div className="flex items-center mt-4 lg:mt-0">
                <Link to="/UserDashboard">
                  <div className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full ml-2">
                    <img
                      src={getProfilePic()}
                      className="object-cover w-full h-full"
                      alt="avatar"
                    />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
