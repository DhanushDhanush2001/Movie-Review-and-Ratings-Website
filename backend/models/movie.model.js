const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },      
    description: { 
        type: String, 
        required: true 
    },
    genre: { 
        type: [String], 
        required: true 
    },
    releaseDate: { 
        type: Date, 
        required: true 
    },
    posterUrl: {
         type: String 
        },
    averageRating: { 
        type: Number, 
        default: 0 
    },
}, { timestamps: true });

module.exports = mongoose.model("Movie", MovieSchema);