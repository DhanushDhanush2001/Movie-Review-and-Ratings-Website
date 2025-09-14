import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../axios/axiosInstance";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/getAllReviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReviews(res.data.reviews || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      toast.error("Failed to load reviews");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axiosInstance.delete(`/api/admin/deleteReview/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Review deleted");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error.message);
      toast.error("Failed to delete review");
    }
  };

  // State to manage "Read More" toggle
  const [expandedComments, setExpandedComments] = useState({});

  const toggleComment = (id) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the comment visibility
    }));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-white">Loading reviews...</div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray mb-6">
        📝 Review Management
      </h1>

      <div className="overflow-x-auto">
        <table className="table w-full bg-base-100 shadow-md rounded-lg">
          <thead>
            <tr className="bg-base-300 text-base-content">
              <th>User</th>
              <th>Movie</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No reviews found.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="hover">
                  <td className="text-gray">
                    {review.userId?.name || "N/A"}
                  </td>
                  <td className="text-gray">
                    {review.movieId?.title || "N/A"}
                  </td>
                  <td className="text-gray">{review.rating}</td>
                  <td className="text-gray">
                    <div className="relative">
                      <p>
                        {expandedComments[review._id]
                          ? review.comment || "No comment"
                          : review.comment
                          ? `${review.comment.slice(0, 100)}...`
                          : "No comment"}{" "}
                        {review.comment && review.comment.length > 100 && (
                          <button
                            className="text-blue-500 text-sm"
                            onClick={() => toggleComment(review._id)}
                          >
                            {expandedComments[review._id]
                              ? "Read less"
                              : "Read more"}
                          </button>
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="text-gray">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white text-sm rounded-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewManagement;
