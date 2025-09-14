const express = require("express");
const { createAdminManually, loginAdmin, getUserById, updateUserByAdmin, getAllUsers, deleteUserByAdmin, createUserByAdmin, deleteReviewByAdmin, getAllReviews } = require('../controllers/adminController');
const admin = require("../middleware/admin");
const { fieldsValidation } = require("../middleware/fieldsValidation")

const router = express.Router()


router.route("/register").post(fieldsValidation(["name", "email", "password"]),createAdminManually);
router.route("/createNewUser").post(admin,createUserByAdmin);
router.route("/login").post(fieldsValidation(["email", "password"]),loginAdmin);
router.route("/getUserById/:id").get(admin,getUserById);
router.route("/updateUserByAdmin/:id").put(admin,updateUserByAdmin);
router.route("/getAllUsers").get(admin,getAllUsers);
router.route("/delete/:id").put(admin,deleteUserByAdmin);

router.route("/deleteReview/:id").delete(admin,deleteReviewByAdmin);
router.route("/getAllReviews").get(admin,getAllReviews);

module.exports = router;
