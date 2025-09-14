import React, { useState, useEffect } from "react";
import MovieCard from "../Components/MovieCard";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/movie/getAllMovie");
      const movieList = response.data?.movies || []; // safe fallback
      setMovies(movieList);
      console.log("✅ Fetched Movies:", movieList);
    } catch (error) {
      console.error("❌ Error fetching movies:", error.message);
      toast.error("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (movieId) => {
    navigate(`/movie-details/${movieId}`);
  };

  const handleAddToWatchlist = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("⚠️ Please login to add movies to your watchlist.");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/api/watchList/addToWatchlist",
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ " + response.data.message);
    } catch (error) {
      console.error(
        "❌ Error adding to watchlist:",
        error.response?.data?.message || error.message
      );
      toast.error(
        "❌ " + (error.response?.data?.message || "Failed to add to watchlist")
      );
    }
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  // ✅ Safe filtered movies
  const filteredMovies = (movies || []).filter((movie) =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">🎬 Browse Movies</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search movies by title..."
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading movies...</p>
      ) : filteredMovies.length === 0 ? (
        <p className="text-gray-400">No movies found.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onViewDetails={handleViewDetails}
              onAddToWatchlist={handleAddToWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
