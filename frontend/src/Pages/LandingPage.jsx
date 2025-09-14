import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const isAuthenticated = localStorage.getItem("token"); // Check if user is authenticated

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white px-6">
      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-600 mb-6 leading-tight">
          CineReviews
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
          Rate, review, and track your favorite movies. Share your opinions and see what others think about the latest releases.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/movies"
              className="px-8 py-4 bg-cyan-600 text-white font-semibold rounded-lg text-lg hover:bg-cyan-500 transition duration-300"
            >
              Explore Movies
            </Link>
          ) : (
            <Link
              to="/register"
              className="px-8 py-4 bg-cyan-600 text-white font-semibold rounded-lg text-lg hover:bg-cyan-500 transition duration-300"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
