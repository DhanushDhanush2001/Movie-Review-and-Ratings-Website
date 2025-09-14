const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/passwordUtilities");
const createToken = require("../utils/loginToken");
const reviewModel = require("../models/review.model");


// 👉 Manually Create a New Admin
const createAdminManually = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // for validation used the middleware

        
        //This is better for cleaner and consistent error responses, 
        // especially in large projects or production apps.
        //   if (!name || !email || !password) {
        //     const error = new Error("All fields (name, email, and password) are required.");
        //     error.statusCode = 400;
        //     return next(error);
        //   }
           

        console.log("🆕 Admin: Manual admin creation request received for:", name);

        // Check if the email is already used
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const newAdmin = new userModel({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });

        const savedAdmin = await newAdmin.save();
        console.log("✅ Admin created manually:", savedAdmin.name);

        res.status(201).json({ message: "Admin created successfully", admin: savedAdmin });
    } catch (error) {
        console.error("❌ Error in createAdminManually:", error.message);
        next(error);
    }
};

// Create a user (by admin)
const createUserByAdmin = async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;
  
      console.log("🆕 Admin creating user:", email);
  
      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }
  
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
  
      const hashedPassword = await hashPassword(password);
  
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        role: role || "user", // Default to "user" if role not provided
      });
  
      const savedUser = await newUser.save();
  
      console.log("✅ User created by admin:", savedUser.name);
      const userObject = savedUser.toObject();
      delete userObject.password;
  
      res.status(201).json({ message: "User created successfully", user: userObject });
    } catch (error) {
      console.error("❌ Error in createUserByAdmin:", error.message);
      next(error);
    }
  };
  

//admin LOGIN
const loginAdmin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      console.log("🔐 Admin login attempt:", email);
  
      const user = await userModel.findOne({ email });
      if (!user) {
        console.log("❌ Admin not found with email:", email);
        return res.status(404).json({ message: "Admin not found" });
      }
  
      // 👉 Role check
      if (user.role !== "admin") {
        console.log("❌ Access denied. Not an admin:", email);
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        console.log("❌ Incorrect password for admin:", email);
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const userObject = user.toObject();
      delete userObject.password;
  
      const token = createToken(user._id);
  
      console.log("✅ Admin login successful:", user.name);
      res.status(200).json({
        message: "Admin login successful",
        token,
        user: userObject,
      });
  
    } catch (error) {
      console.error("🚨 Admin login error:", error);
      next(error);
    }
  };
  

// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        console.log("🔹 Admin: Fetching all users...");
        const users = await userModel.find().select("-password");
        res.status(200).json({ totalUsers: users.length, users });
    } catch (error) {
        console.error("❌ Error in getAllUsers:", error.message);
        next(error);
    }
};

// Get a single user by ID
const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        console.log("🔹 Admin: Fetching user by ID:", userId);
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json({user:user});
    } catch (error) {
        console.error("❌ Error in getUserById:", error.message);
        next(error);
    }
};

// Update user role or data (e.g. make someone admin)
const updateUserByAdmin = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        console.log("🔹 Admin: Updating user:", userId, updateData);

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true, select: "-password" }
        );

        if (!updatedUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("❌ Error in updateUserByAdmin:", error.message);
        next(error);
    }
};

// Delete user by admin
const deleteUserByAdmin = async (req, res, next) => {
    try {
        const userId = req.params.id;
        console.log("🔹 Admin: Deleting user:", userId);

        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("❌ Error in deleteUserByAdmin:", error.message);
        next(error);
    }
};
// Get all reviews
const getAllReviews = async (req, res, next) => {
  try {
    console.log("🔍 Admin: Fetching all reviews...");
    const reviews = await reviewModel
      .find()
      .populate("userId", "name email")
      .populate("movieId", "title");
    res.status(200).json({ totalReviews: reviews.length, reviews });
  } catch (error) {
    console.error("❌ Error in getAllReviews:", error.message);
    next(error);
  }
};




// Delete a review by admin
const deleteReviewByAdmin = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    console.log("🗑️ Admin deleting review:", reviewId);
    const deletedReview = await reviewModel.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({message: "Review deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteReviewByAdmin:", error.message);
    next(error);
  }
};

module.exports = {
    getAllUsers,
    loginAdmin,
    getUserById,
    updateUserByAdmin,
    deleteUserByAdmin,
    createAdminManually, // ⬅️ added this export
    createUserByAdmin,
    deleteReviewByAdmin,
    getAllReviews
};