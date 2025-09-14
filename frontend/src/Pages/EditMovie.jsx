import React, { useEffect, useState } from "react";
// import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";

const EditMovie = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false); // 🔁 New loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axiosInstance.get(`/api/movie/getMovieById/${movieId}`);
        const { title, genre, posterUrl, releaseDate, description } = res.data.movie;
        setMovie(res.data.movie);
        setTitle(title);
        setGenre(genre);
        setPosterUrl(posterUrl);
        setReleaseDate(releaseDate);
        setDescription(description || "");
      } catch (error) {
        toast.error("Failed to fetch movie details");
      }
    };
    fetchMovie();
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("genre", genre);
      formData.append("releaseDate", releaseDate);
      formData.append("description", description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axiosInstance.put(`/api/movie/update/${movieId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Movie updated successfully");
      navigate("/admin/movies");
    } catch (error) {
      toast.error("Failed to update movie");
    } finally {
      setLoading(false); // End loading
    }
  };

  if (!movie) {
    return <div className="text-center text-c py-8">Loading movie details...</div>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray mb-4">Edit Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Movie Title"
          required
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre"
          required
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
        <div>
          <label className="block text-white mb-1">Current Poster</label>
          <img
            src={posterUrl}
            alt="Movie Poster"
            className="w-40 h-auto rounded shadow mb-2"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          required
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 bg-gray-800 text-white rounded h-32"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Updating...
            </span>
          ) : (
            "Update Movie"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditMovie;
