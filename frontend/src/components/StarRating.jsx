import React from "react";
import { FaStar } from "react-icons/fa";

function StarRating({ rating, setRating }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`cursor-pointer transition 
            ${star <= rating ? "text-yellow-400" : "text-gray-400"}
          `}
          size={50}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
}

export default StarRating;
