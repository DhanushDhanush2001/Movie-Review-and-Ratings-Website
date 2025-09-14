const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    console.log("🔹 Auth Middleware Invoked");

    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.split(" ")[1];

    if (!authToken) {
      console.log("❌ No Auth Token Found");
      return res.status(401).json({ status: false, message: "No auth token" });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      console.log("❌ User Not Found in Database");
      return res.status(404).json({ status: false, message: "User not found" });
    }

    req.user = user._id;
    req.userRole = user.role;
    console.log("✅ User Authenticated:", user.name, "| ID:", user._id);

    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    return res.status(401).json({ status: false, message: "Please login" });
  }
};

module.exports = { auth };
