import React, { useState } from "react";
import axiosInstance from "../axios/axiosInstance";
import StarRating from "./StarRating";
import { useParams } from "react-router-dom";

const AddReview = () => {
  const { movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Please login to submit a review.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/api/review/addReview/${movieId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Review added!");
      setComment("");
      setRating(0);
    } catch (error) {
      console.error("❌ Error adding review:", error.response?.data?.message);
      alert("❌ " + error.response?.data?.message);
    }
  };

  return (
    <div className="mt-10  p-6 rounded-2xl bg-gray-900 shadow-lg border border-gray-800">
      <h3 className="text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
      Add Your Review
      </h3>
      <form onSubmit={handleReviewSubmit}>
        <div className="mb-5">
          <label className="block text-lg font-medium text-gray-300 mb-2">
            Your Rating:
          </label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div className="mb-5">
          <label className="block text-lg font-medium text-gray-300 mb-2">
            Your Comment:
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            rows="5"
            placeholder="Write your review here..."
            required
          />
        </div>
        <button
  type="submit"
  className="py-3 px-6 rounded-lg text-lg font-semibold bg-cyan-500 hover:bg-cyan-600 transition duration-300"
>Submit Review
</button>
      </form>
    </div>
  );
};

export default AddReview;
