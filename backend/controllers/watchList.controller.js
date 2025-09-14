const movieModel = require("../models/movie.model");
const watchListModel = require("../models/watchlist.model");


// ➕ Add movie to user's watchlist
const addToWatchlist = async (req, res, next) => {
  try {
    const userId = req.user;
    const { movieId } = req.body;

    console.log("📥 [addToWatchlist] Request received");
    console.log("👤 User ID:", userId);
    console.log("🎬 Movie ID:", movieId);

    // Check if the movie exists
    const movie = await movieModel.findById(movieId);
    if (!movie) {
      console.log("🚫 Movie not found in database");
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    console.log("✅ Movie exists:", movie.title);

    // Find or create a watchlist for the user
    let watchlist = await watchListModel.findOne({ userId });

    if (!watchlist) {
      console.log("🆕 No watchlist found, creating new one...");
      //creating new watchlist
      watchlist = await watchListModel.create({ userId, movies: [movieId] }); 
      console.log("✅ New watchlist created with movie");
    } else {
      if (watchlist.movies.includes(movieId)) {//checking if the movie is already exist
        console.log("⚠️ Movie already exists in watchlist");
        return res.status(400).json({ success: false, message: "Movie already in watchlist" });
      }
      console.log("📌 Adding movie to existing watchlist...");
      watchlist.movies.push(movieId);
      await watchlist.save();
      console.log("✅ Movie added to watchlist");
    }

    res.status(200).json({
      success: true,
      message: "Movie added to watchlist",
      data: watchlist,
    });

  } catch (error) {
    console.error("❌ Error in addToWatchlist:", error.message);
    next(error);
  }
};


// 📥 Get all movies in a user's watchlist
const getWatchlist = async (req, res, next) => {
  try {
    let userId = req.user;

    // Log the current user and role
    console.log("🔐 User Role:", req.userRole);
    console.log("👤 Requested by User ID:", req.user);

    // Allow admin to pass a userId in query
    if (req.userRole === "admin" && req.query.userId) {
      userId = req.query.userId;
      console.log("🛡️ Admin is fetching watchlist for User ID:", userId);
    }

    const watchlist = await watchListModel.findOne({ userId }).populate("movies");

    if (!watchlist) {
      console.log("📭 No watchlist found for this user.");
      return res.status(200).json({ success: true, totalMovies: 0, watchlist: [] });
    }

    console.log("🎬 Watchlist found. Total movies:", watchlist.movies.length);

    res.status(200).json({
      success: true,
      totalMovies: watchlist.movies.length,
      watchlist: watchlist.movies,
    });
  } catch (error) {
    console.error("❌ Error in getWatchlist:", error.message);
    next(error);
  }
};


// ❌ Remove a movie from the watchlist
const removeFromWatchlist = async (req, res, next) => {
  try {
    const userId = req.user;
    const movieId = req.params.movieId;

    console.log("🔐 User ID:", userId);
    console.log("🎯 Requested Movie ID to Remove:", movieId);

    const watchlist = await watchListModel.findOne({ userId });
    if (!watchlist) {
      console.log("📭 No watchlist found for this user.");
      return res.status(404).json({ success: false, message: "Watchlist not found" });
    }

    const originalLength = watchlist.movies.length;
    console.log("🎬 Original Watchlist Movie Count:", originalLength);

    const updatedMovies = watchlist.movies.filter(
      (id) => id.toString() !== movieId
    );

    if (updatedMovies.length === originalLength) {
      console.log("⚠️ Movie not found in watchlist. No changes made.");
      return res.status(404).json({ success: false, message: "Movie not found in watchlist" });
    }

    watchlist.movies = updatedMovies;
    await watchlist.save();

    console.log("✅ Movie removed from watchlist. New count:", updatedMovies.length);

    res.status(200).json({ success: true, message: "Movie removed from watchlist" });
  } catch (error) {
    console.error("❌ Error in removeFromWatchlist:", error.message);
    next(error);
  }
};



module.exports = {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
};