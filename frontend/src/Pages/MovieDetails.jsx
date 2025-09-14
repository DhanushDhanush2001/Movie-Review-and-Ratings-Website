import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import AddReview from "../Components/AddReview";
import GetAllReviews from "../Components/GetAllReviews";

const MovieDetails = () => {
  const { movieId } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);

  const handleAddToWatchlist = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Please login to add movies to your watchlist.");
      return;
    }
  
    try {
      const response = await axiosInstance.post(
        "/api/watchList/addToWatchlist",
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ " + response.data.message);
    } catch (error) {
      console.error("❌ Error adding to watchlist:", error.response.data.message);
      alert("❌ " + error.response.data.message);
    }
  };  

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/movie/getMovieById/${movieId}`);
        setMovie(response.data.movie);
        console.log(response.data.movie);
      } catch (error) {
        console.error("❌ Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);               //look into useEFFECT

  if (!movie) {
    return <div>No movie found...</div>;
  }

  return (
    <div className="text-white p-8">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">🎬 {movie.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-96 object-contain rounded-xl"
        />
        <div>
          <p className="text-gray-400 mb-2">🎭 Genre: {movie.genre.join(", ")}</p>
          <p className="text-gray-400 mb-2">📅 Year: {new Date(movie.releaseDate).getFullYear()}</p>
          <p className="text-gray-400 mb-2">⭐ Rating: {movie.averageRating ? movie.averageRating.toFixed(1) : "N/A"}</p>
          <p className="text-gray-400 mb-4">{movie.description}</p>
          <button 
            onClick={(() => handleAddToWatchlist(movie._id))}
          className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded">
            Add to Watchlist
          </button>
         
        </div>
         
      </div>
      {/* 👉 AddReview form here */}
      <AddReview/>
      {/* 👉 Reviews list here */}
      <GetAllReviews />
    </div>
  )
}

export default MovieDetails;
