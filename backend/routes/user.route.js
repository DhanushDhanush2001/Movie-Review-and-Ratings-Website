const express = require("express");
const {registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser} = require("../controllers/user.controller");
const {auth} = require("../middleware/auth");
const {fieldsValidation} = require('../middleware/fieldsValidation')
const {upload} = require('../middleware/multer')

const router = express.Router()

router.route("/register").post(fieldsValidation(["name", "email", "password"]), registerUser);
router.route("/login").post(fieldsValidation(["email", "password"]), loginUser);
router.route("/profile").get(auth,getUserProfile);
router.route("/update").patch(auth, upload.single("profilePic"), updateUserProfile);
router.route("/delete").delete(auth,deleteUser);

module.exports = router;


