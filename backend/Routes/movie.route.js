import express from 'express'
import { getMovieDetails, getMoviesByCategory, getMovieTrailers, getSimilarMovies, getTrendingMovie } from '../controllers/movie.controller.js';

const router = express.Router();

router.route("/trending").get(getTrendingMovie);
router.route("/:id/trailers").get(getMovieTrailers);
router.route("/:id/details").get(getMovieDetails);
router.route("/:id/similar").get(getSimilarMovies);
router.route("/:category").get(getMoviesByCategory);

export default router; 