const express = require("express");
const admin = require("../middleware/admin");
const { getDashboardStats } = require("../controllers/adminDashboardController");

const router = express.Router()

router.route("/stats").get(admin,getDashboardStats);

module.exports = router;