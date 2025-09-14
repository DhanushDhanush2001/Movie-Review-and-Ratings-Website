const express = require("express");
const {addToWatchlist,getWatchlist,removeFromWatchlist} = require("../controllers/watchList.controller");
const {auth} = require("../middleware/auth");

const router = express.Router();

router.route("/addToWatchlist").post(auth,addToWatchlist);
router.route("/getWatchlist").get(auth, getWatchlist);
router.route("/removeFromWatchlist/:movieId").delete(auth, removeFromWatchlist);


module.exports = router;

