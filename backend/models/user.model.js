const defaultAvatars = [
    "https://res.cloudinary.com/dvgz6hz6h/image/upload/v1745401876/avatar3_dua54m.jpg",
    "https://res.cloudinary.com/dvgz6hz6h/image/upload/v1745401878/defalutAvatar_svvxyt.jpg",
    "https://res.cloudinary.com/dvgz6hz6h/image/upload/v1745401875/avatar2_axvpfz.jpg"
  ];
  
  // Randomly pick one avatar from the array
  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
    return defaultAvatars[randomIndex];
  };


const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true ,
        min:3,
        max:15,
        trim: true 
        },
    email:{ 
            type: String,
            required: true, 
            unique: true ,
            match: [/.+\@.+\..+/, "Please enter a valid email address"]
        },
    password: { 
        type: String, 
        required: true 
    },
    profilePic: { 
                type: String, 
                default: getRandomAvatar() // Use the random avatar function          
            },
    role: {
         type: String, 
         enum: ["user", "admin"],  // Admin or normal user
         default: "user"
         },
    watchlist: [
                {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Movie",
                },
            ],
          
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);