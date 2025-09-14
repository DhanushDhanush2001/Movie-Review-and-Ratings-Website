const movieModel = require("../models/movie.model");
const uploadToCloudinary = require("../utils/imageUpload");
const fs = require("fs/promises");


const createMovie = async (req, res, next) => {
    try {
        const { title, description, genre, releaseDate } = req.body;

        // 1. Check if image is uploaded
        if (!req.file) {
            console.log("🖼️ No image uploaded.");
            return res.status(400).json({ error: "Image is required" });
        }

        console.log("📥 File received:", req.file.filename);
        // console.log("🔑 Cloudinary API Key:", process.env.API_KEY);

        // 2. Upload image to Cloudinary
        const imageUrl = await uploadToCloudinary(req.file.path);
        console.log("✅ Image uploaded to Cloudinary:", imageUrl);

        // 3. Save movie to MongoDB
        const newMovie = await movieModel.create({
            title,
            description,
            genre,
            releaseDate,
            posterUrl: imageUrl,
        });

        console.log("🎬 Movie added successfully:", newMovie.title);

        // 4. Send response
        return res.status(201).json({
            message: "🎉 Movie added successfully!",
            movie: newMovie,
        });


    } catch (error) {
        console.error("❌ Error in createMovie:", error.message);
        next(error);
    }
};

// @desc    Get all movies
const getAllMovies = async (req, res, next) => {
    try {
        const movies = await movieModel.find();
        console.log(`📽️ Total Movies Fetched: ${movies.length}`);
        res.status(200).json({ total: movies.length, movies });
    } catch (error) {
        console.error("❌ Error fetching movies:", error.message);
        next(error);
    }
};

// @desc    Get movie by ID
const getMovieById = async (req, res, next) => {
    try {
        const movie = await movieModel.findById(req.params.id);
        if (!movie) {
            console.warn(`⚠️ Movie not found for ID: ${req.params.id}`);
            const error = new Error("Movie not found");
            error.statusCode = 404;
            return next(error);
        }
        console.log(`🎞️ Movie Fetched: ${movie.title} (ID: ${req.params.id})`);
        res.status(200).json({movie:movie});
    } catch (error) {
        console.error(`❌ Error fetching movie by ID (${req.params.id}):`, error.message);
        next(error);
    }
};

// @desc    Update movie
const updateMovie = async (req, res, next) => {
    try {
        const movieId = req.params.id;

        // 1. Find the movie
        const movie = await movieModel.findById(movieId);
        if (!movie) {
            console.warn(`⚠️ Movie not found with ID: ${movieId}`);
            return res.status(404).json({ error: "Movie not found" });
        }

        // 2. Build the update object dynamically
        const updateData = { ...req.body }; // copies only sent fields

        // 3. If a new image is uploaded
        if (req.file) {
            console.log("📤 New image uploaded:", req.file.filename);
            const imageUrl = await uploadToCloudinary(req.file.path,"Movies Poster");
            // fs.unlink(req.file.path); // delete local file
            await  fs.unlink(req.file.path); 
            updateData.posterUrl = imageUrl;
        }

        // 4. Update the movie
        const updatedMovie = await movieModel.findByIdAndUpdate(
            movieId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        console.log("🔄 Movie updated:", updatedMovie.title);

        // 5. Response
        return res.status(200).json({
            message: "✅ Movie updated successfully",
            updatedMovie,
        });

    } catch (error) {
        console.error("❌ Error updating movie:", error.message);
        next(error);
    }
};


// @desc    Delete movie
const deleteMovie = async (req, res, next) => {
    try {
        const movie = await movieModel.findByIdAndDelete(req.params.id);
        if (!movie) {
            const error = new Error("Movie not found");
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting movie:", error.message);
        next(error);
    }
};

module.exports = {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
};