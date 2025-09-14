import React, { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa"; // For star icons

const GetAllReviews = () => {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/api/review/getReviewsByMovie/${movieId}`);
      setReviews(response.data.data);
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  return (
  <div className="mt-10 flex flex-col items-center">
    <h3 className="text-2xl font-semibold text-cyan-400 mb-6">User Reviews</h3>
    {reviews.length === 0 ? (
      <p className="text-gray-400">No reviews yet. Be the first to comment!</p>
    ) : (
      reviews.map((review) => (
        <div
          key={review._id}
          className="max-w-2xl mb-6 px-8 py-6 bg-white rounded-lg shadow-md dark:bg-gray-800 w-full"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-light text-gray-600 dark:text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${
                    i < review.rating ? "text-yellow-400" : "text-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-lg font-bold text-gray-700 dark:text-white">
              {review.comment.length > 50 ? review.comment.slice(0, 50) + "..." : review.comment}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{review.comment}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              Read more
            </span>

            <div className="flex items-center">
              <img
                src={review.userId.profilePic}
                alt="DP"
                className="w-10 h-10 mx-4 rounded-full object-cover border border-white shadow-md"
              />
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {review.userId.name}
              </span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

};

export default GetAllReviews;
