const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema({
    userId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "User", 
         required: true 
        },
    movies: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Movie" }
    ],
    default: [],
}, { timestamps: true });
 
module.exports = mongoose.model("Watchlist", WatchlistSchema);