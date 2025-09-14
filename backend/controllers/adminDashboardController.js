const userModel = require('../models/user.model');
const movieModel = require('../models/movie.model');
const reviewModel = require('../models/review.model');

const getDashboardStats = async (req, res, next) => {
  try {
    console.log("📊 Fetching dashboard data...");

    const totalUsers = await userModel.countDocuments();
    console.log("👥 Total Users:", totalUsers);

    const totalMovies = await movieModel.countDocuments();
    console.log("🎬 Total Movies:", totalMovies);

    const totalReviews = await reviewModel.countDocuments();
    console.log("📝 Total Reviews:", totalReviews);

    res.status(200).json({
      success: true,
      message: "✅ Dashboard data fetched successfully",
      data: {
        totalUsers,
        totalMovies,
        totalReviews,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error.message);
    next(error);
  }
};

module.exports = { getDashboardStats };