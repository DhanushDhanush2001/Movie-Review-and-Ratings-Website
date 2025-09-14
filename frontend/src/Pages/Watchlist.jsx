import React, { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";  // ✅ Import toast

function Watchlist() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);  // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch watchlist from backend
  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("❌ No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/api/watchList/getWatchlist", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Ensure the response is valid and set to an empty array if undefined
        setWatchlist(response.data.watchlist || []);  // Set default to empty array
        setError("");  // Reset error state if successful
      } catch (error) {
        console.error("❌ Error fetching watchlist:", error);
        setError("Failed to load your watchlist. Please try again.");
        toast.error("❌ Failed to load watchlist. Please try again.");  // ✅ Add error toast
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // Handle navigate to movie details page
  const handleViewDetails = (movieId) => {
    console.log("📌 View details for movie:", movieId);
    navigate(`/movie-details/${movieId}`);
  };

  // Handle remove movie from watchlist
  const handleRemoveMovie = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirm = window.confirm("Are you sure you want to remove this movie?");
    if (!confirm) return;

    try {
      // Send DELETE request to remove movie from watchlist by movieId
      const response = await axiosInstance.delete(`/api/v1/watchList/removeFromWatchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("🗑️ Removed movie:", response.data);
      
      // Show success toast
      toast.success("Movie removed from watchlist!");

      // Remove the movie from the watchlist state
      setWatchlist((prevWatchlist) => {
        return prevWatchlist.filter((movie) => movie._id !== movieId);
      });
    } catch (error) {
      console.error("❌ Error removing movie:", error);
      toast.error("❌ Failed to remove movie. Please try again.");
    }
  };

  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">🎬 My Watchlist</h2>

      {loading ? (
        <p className="text-gray-400">Loading your watchlist...</p>
      ) : error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : watchlist.length === 0 ? (
        <p className="text-gray-400">Your watchlist is empty. Add some movies!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {watchlist.map((movie) => (
            <div key={movie._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <img
                src={movie.posterUrl || "/default-poster.jpg"}
                alt={movie.title}
                className="w-full h-72 object-contain"
                onError={(e) => { e.target.src = "/default-poster.jpg"; }}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">{movie.title}</h3>
                <p className="text-gray-400">{movie.genre.join(", ")}</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleViewDetails(movie._id)}
                    className="w-full sm:w-1/2 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded transition duration-300"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleRemoveMovie(movie._id)}
                    className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;
