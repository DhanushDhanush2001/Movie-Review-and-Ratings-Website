const express = require("express");
const {createMovie,getAllMovies,getMovieById,deleteMovie,updateMovie} = require("../controllers/movie.controller");
const { fieldsValidation } = require("../middleware/fieldsValidation");
const admin = require("../middleware/admin");
const {upload} = require('../middleware/multer')


const router = express.Router();

router.route("/create").post(admin,upload.single("image"),fieldsValidation(["title", "description", "genre", "releaseDate"]),createMovie);
router.route("/getAllMovie").get(getAllMovies);
router.route("/getMovieById/:id").get(getMovieById);
router.route("/update/:id").put(admin,upload.single("image"),updateMovie);
router.route("/delete/:id").delete(admin,deleteMovie);

module.exports = router;
