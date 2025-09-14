import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../axios/axiosInstance";

const MoviesManagement = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const res = await axiosInstance.get("/api/movie/getAllMovie");
      setMovies(res.data.movies);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error.message);
      toast.error("Failed to load movies");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await axiosInstance.delete(`/api/movie/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Movie deleted");
      fetchMovies();
    } catch (error) {
      console.error("Error deleting movie:", error.message);
      toast.error("Failed to delete movie");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Filter movies by search term
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10 text-grey">Loading movies...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-grey">🎬 Movies Management</h1>
        <Link to="/admin/movies/create">
          <button className="bg-green-600 hover:bg-green-700 text-grey px-4 py-2 rounded-lg shadow-md transition text-sm sm:text-base">
            + Create Movie
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by movie title..."
          className="w-full md:w-1/2 px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-800 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full bg-base-100 shadow-md rounded-lg text-sm sm:text-base">
          <thead>
            <tr className="bg-base-300 text-base-content">
              <th>Poster</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Release Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.map((movie) => (
              <tr key={movie._id} className="hover">
                <td>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded-md"
                  />
                </td>
                <td className="text-white">
                  <Link
                    to={`/movie-details/${movie._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {movie.title}
                  </Link>
                </td>
                <td className="text-gray">{movie.genre}</td>
                <td className="text-gray">
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/movies/edit/${movie._id}`}
                      className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white text-sm rounded-md transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(movie._id)}
                      className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white text-sm rounded-md transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredMovies.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden space-y-4">
        {filteredMovies.length === 0 ? (
          <p className="text-center text-gray-400">No movies found.</p>
        ) : (
          filteredMovies.map((movie) => (
            <div key={movie._id} className="bg-base-100 rounded-lg p-4 shadow-md">
              <div className="flex gap-4">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-md"
                />
                <div className="flex-1 text-white">
                  <h2 className="text-lg font-semibold">
                    <Link
                      to={`/movie-details/${movie._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {movie.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-300">Genre: {movie.genre}</p>
                  <p className="text-sm text-gray-300">
                    Release: {new Date(movie.releaseDate).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Link
                      to={`/admin/movies/edit/${movie._id}`}
                      className="flex-1 text-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 text-sm rounded-md transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(movie._id)}
                      className="flex-1 text-center bg-red-700 hover:bg-red-800 text-white px-3 py-1 text-sm rounded-md transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MoviesManagement;
