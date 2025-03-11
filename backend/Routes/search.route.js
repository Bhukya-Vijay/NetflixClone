import express from 'express'
import { getSearchHistroy, removeItemFromSearchHistory, searchMovie, searchPerson, searchTv } from '../controllers/search.controller.js';

const router = express.Router();

router.route("/person/:query").get(searchPerson);
router.route("/movie/:query").get(searchMovie);
router.route("/tv/:query").get(searchTv);

router.route("/history").get(getSearchHistroy);
router.delete("/history/:id", removeItemFromSearchHistory)

export default router