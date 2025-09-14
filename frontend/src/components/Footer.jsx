import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center">
        {/* Logo / App Name */}
        <h2 className="text-2xl font-bold mb-4">CineReviews</h2>

        {/* Description */}
        <p className="text-center max-w-md text-sm leading-relaxed mb-6">
          Rate, review, and track your favorite movies. Share your opinions and discover what others think about the latest releases.
        </p>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm">
          © 2025 CineReviews. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
