import React, { useState } from "react";
import axiosInstance from "../axios/axiosInstance";
import { FaTrash } from "react-icons/fa";

const MAX_WORDS = 30; // Limit before truncating

const UserDashReviewcard = ({ review, onDelete }) => {
  const [showFullComment, setShowFullComment] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`api/review/deleteReview/${review._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onDelete(review._id);
      console.log("✅ Review deleted:", response.data);
    } catch (error) {
      console.error("❌ Error deleting review:", error.message);
    }
  };

  const toggleComment = () => setShowFullComment(!showFullComment);

  const getTruncatedComment = (text) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= MAX_WORDS) return text;
    return words.slice(0, MAX_WORDS).join(" ") + "...";
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex gap-4 relative">
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <FaTrash className="w-5 h-5" />
      </button>

      <img
        src={review.movieId?.posterUrl} 
        alt={review.movieId?.title}
        className="w-20 h-28 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{review.movieId?.title}</h3>
        <p className="text-gray-300 mt-1">⭐ {review.rating} / 5</p>
        
        {/* Review comment with toggle */}
        <p className="mt-2 text-gray-200">
          {showFullComment ? review.comment : getTruncatedComment(review.comment)}
          {review.comment.split(" ").length > MAX_WORDS && (
            <span
              onClick={toggleComment}
              className="text-blue-400 cursor-pointer ml-2"
            >
              {showFullComment ? "Read less" : "Read more"}
            </span>
          )}
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Reviewed on {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default UserDashReviewcard;