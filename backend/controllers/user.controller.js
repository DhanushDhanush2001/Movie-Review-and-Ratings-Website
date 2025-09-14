const bcrypt = require("bcrypt");
const fs = require("fs");
const createToken = require("../utils/loginToken");
const userModel = require("../models/user.model");
const {
  hashPassword,
  comparePassword,
} = require("../utils/passwordUtilities");
const uploadToCloudinary = require("../utils/imageUpload");
// Register a new user
const registerUser = async (req, res, next) => {
  try {
    console.log("🟢 Register User API hit");

    const { name, email, password } = req.body;
    console.log(`📩 Received Data -> Name: ${name}, Email: ${email}`);

    // Check if user already exists
    console.log("🔍 Checking if user already exists...");
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      console.log("❌ User already exists.");
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    console.log("🆕 Creating new user...");
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("✅ User registered successfully:", savedUser);

    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        savedUser,
      });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    next(error);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login attempt for email:", email);

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("❌ User not found with email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password for email:", email);

      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //     console.log("❌ Incorrect password for email:", email);
    //     return res.status(400).json({ message: "Invalid credentials" });
    // }

    // Convert Mongoose document to plain object & remove password
    const userObject = user.toObject();
    delete userObject.password;

    // JWT token
    const token = createToken(user._id, user.role);  // Pass user.role here
    
    console.log("✅ Login successful for user:", user.name, "| ID:", user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userObject,
    });
  } catch (error) {
    console.error("🚨 Login error:", error);
    console.error(
      "❌ Login Error:",
      error.response ? error.response.data : error.message
    );
    next(error);
  }
};

// Get user profile

// Controller function to get user profile details
const getUserProfile = async (req, res) => {
  try {
    console.log("🔹 getUserProfile Controller Invoked"); // Log controller initiation
    console.log("📌 Request User ID:", req.user); // Log the user ID from the request

    // Fetch the user from the database using the ID stored in req.user (extracted from token)
    const user = await userModel.findById(req.user).select("-password"); // Exclude the password field

    // If no user is found, return a 404 response
    if (!user) {
      console.log("❌ User Not Found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User Profile Retrieved:", user.name, "| ID:", user._id); // Log user details
    res.status(200).json({
      status: true,
      user: user,
    });
  } catch (error) {
    console.error("❌ Error in getUserProfile:", error.message);
    next(error);
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
      const { name, email } = req.body;
      let profilePicUrl;
      console.log("req.body:", req.body);
console.log("req.file:", req.file);

  
      // If a file is uploaded, upload it to Cloudinary
      if (req.file) {
        profilePicUrl = await uploadToCloudinary(
          req.file.path,
          "Profile Pictures"  // folder name in Cloudinary
        );
      }
  
      // Update user details in MongoDB
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user,
        {
          name,
          email,
          ...(profilePicUrl && { profilePic: profilePicUrl }), // Only if new profile pic is uploaded
        },
        { new: true } // return the updated user document
      );
  
      res.status(200).json({ success: true, user: updatedUser, message: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error in updating user profile:", error);
      res.status(500).json({ success: false, message: "Profile update failed" });
    }
  };

// Delete user
const deleteUser = async (req, res) => {
  try {
    console.log(`🔹 Delete request received for user ID: ${req.user}`);

    // Find the user by ID and delete
    const deletedUser = await userModel.findByIdAndDelete(req.user);

    // If user not found, return error
    if (!deletedUser) {
      console.log(`❌ User with ID ${req.user} not found.`);
      return res.status(404).json({ status: false, message: "User not found" });
    }

    console.log(`✅ User with ID ${req.user} deleted successfully.`);
    res.status(200).json({
      status: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("🚨 Error in deleteUser:", error);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};