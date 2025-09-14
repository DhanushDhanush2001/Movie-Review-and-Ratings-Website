import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import UserDashReviewcard from "../Components/UserDashReviewcard";

function UserDashboard() {
  const token = localStorage.getItem("token");
  const [reviews, setReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);  // Initialize as empty array
  const [userData, setUserData] = useState({});
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);  // Add loading state
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const userResponse = await axiosInstance.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(userResponse.data.user || {});

      // Fetch user reviews (fixed)
      const reviewsResponse = await axiosInstance.get("/api/review/getAllUserReview/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviewsResponse.data.reviews || []);

      // Fetch watchlist
      const watchlistResponse = await axiosInstance.get("/api/watchList/getWatchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(watchlistResponse.data.watchlist || []);
      
    } catch (error) {
      console.error("❌ Error fetching user data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [token, navigate]);

  const handleReviewDelete = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review._id !== reviewId)
    );
  };

  // Render the correct section based on activeSection state
  const renderSection = () => {
    if (loading) {
      return <p className="text-gray-400">Loading...</p>;  // Show loading text or spinner
    }

    switch (activeSection) {
      case "reviews":
        return (
          <div className="px-6 py-4">
            <h2 className="font-semibold text-lg text-white mb-4">
              Your Reviews
            </h2>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-400">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <UserDashReviewcard
                    key={review._id}
                    review={review}
                    onDelete={handleReviewDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      case "watchlist":
        return (
          <div className="px-6 py-4">
            <h2 className="font-semibold text-lg text-white mb-4">
              Your Watchlist
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {watchlist.length === 0 ? (
                <p className="text-gray-400">No movies in your watchlist.</p>
              ) : (
                watchlist.map((movie) => (
                  <div
                    key={movie._id}
                    onClick={() => navigate(`/movie-details/${movie._id}`)}
                    className="cursor-pointer bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-64 object-contain"
                    />
                    <div className="p-4">
                      <p className="text-white text-lg font-semibold">
                        {movie.title}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case "dashboard":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-white">
                Total Reviews
              </h3>
              <p className="text-2xl">{reviews.length}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-white">
                Watchlist Items
              </h3>
              <p className="text-2xl">{watchlist.length}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="container mx-auto">
        <div className="bg-gray-800 relative shadow-xl rounded-2xl w-full md:w-3/4 lg:w-1/2 mx-auto text-white">
          <div className="flex justify-center">
            <img
              src={userData.profilePic}
              alt="User Avatar"
              className="rounded-full mx-auto absolute -top-16 w-32 h-32 shadow-lg border-4 border-gray-900"
            />
          </div>
          <div className="mt-20 text-center">
            <h1 className="text-3xl font-bold">{userData.name}</h1>
            <p className="text-gray-400">{userData.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Joined on {new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className=" flex flex-col sm:flex-row justify-around mt-6 border-t border-gray-700">
            <button
              className={`w-full py-3 hover:bg-gray-700 transition border-b sm:border-b-0 sm:border-r border-gray-700`}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </button>
            <button
              className="w-full py-3 hover:bg-gray-700 transition border-b sm:border-b-0 sm:border-r border-gray-700"
              onClick={() => setActiveSection("reviews")}
            >
              Reviews
            </button>
            <button
              className="w-full py-3 hover:bg-gray-700 transition border-b sm:border-b-0 sm:border-r border-gray-700"
              onClick={() => setActiveSection("watchlist")}
            >
              Watchlist
            </button>
            <button
              className="w-full py-3 hover:bg-gray-700 transition border-b sm:border-b-0 sm:border-r border-gray-700"
              onClick={() => navigate("/edit-profile")}
            >
              Edit Profile
            </button>
            <button
              className="w-full py-3 hover:bg-red-600 bg-red-500 transition text-white font-semibold"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Conditionally render the selected section */}
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;