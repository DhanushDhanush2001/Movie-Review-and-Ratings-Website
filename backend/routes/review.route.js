const express = require("express");
const {addReview,getReviewsByMovie,updateReview,deleteReview,getReviewsByUser} = require("../controllers/review.controller");
const {auth} = require("../middleware/auth");
const { fieldsValidation } = require('../middleware/fieldsValidation');


const router = express.Router()

router.route("/addReview/:movieId").post(auth,fieldsValidation(['comment', 'rating']),addReview);
router.route("/getReviewsByMovie/:movieId").get(getReviewsByMovie);
router.route("/updateReview/:reviewId").put(fieldsValidation(['comment', 'rating']),updateReview);
router.route("/deleteReview/:reviewId").delete(auth,deleteReview);
router.route("/getAllUserReview").get(auth, getReviewsByUser);



module.exports = router;

