import { User } from "../models/userModel.js";
import { fetchFromTMDB } from "../services/tmdb.services.js";

export async function searchPerson(req, res) {
    const { query } = req.params
    // console.log("Recieved Params", req.params)
    try {
        const response = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=${'false' || 'true'}&language=en-US&page=1`
        )

        if (response.results.length === 0) {
            return res.status(404).send(null)
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    uniqueId: `${response.results[0].id} - {${Date.now()}}`,
                    id: response.results[0].id,
                    image: response.results[0].profile_path,
                    title: response.results[0].name,
                    searchType: "person",
                    createdAt: new Date()
                }
            }

        })

        res.status(200).json({ success: true, content: response.results })
    } catch (error) {
        console.log("Error in search person controller: ", error.message);
        res.status(400).json({ success: false, message: "Internal server error" })
    }
}

export async function searchMovie(req, res) {
    // console.log("Recieved Params", req.query.params)
    const { query } = req.params

    try {
        const response = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
        )

        if (response.results.length === 0) {
            return res.status(404).send(null)
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    uniqueId: `${response.results[0].id} - {${Date.now()}}`,
                    id: response.results[0].id,
                    image: response.results[0].poster_path,
                    title: response.results[0].title,
                    searchType: "movie",
                    createdAt: new Date()
                }
            }
        })

        res.status(200).json({ success: true, content: response.results })
    } catch (error) {
        // console.log("Error in search movie controller: ", error.message);
        res.status(400).json({ success: false, message: "Internal server error" })
    }
}

export async function searchTv(req, res) {
    // console.log("Recieved Params", req.query.params)
    const { query } = req.params
    try {
        const response = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
        )
        // console.log(response)

        if (response.results.length === 0) {
            return res.status(404).send(null)
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    uniqueId: `${response.results[0].id} - {${Date.now()}}`,
                    id: response.results[0].id,
                    image: response.results[0].profile_path,
                    title: response.results[0].name,
                    searchType: "tv",
                    createdAt: new Date()
                }
            }
        })

        res.status(200).json({ success: true, content: response.results })
    } catch (error) {
        console.log("Error in search tv controller: ", error.message);
        res.status(400).json({ success: false, message: "Internal server error" })
    }
}

export async function getSearchHistroy(req, res) {
    try {
        res.status(200).json({ success: true, content: req.user.searchHistory })
    } catch (error) {
        res.status(400).json({ success: false, message: "Internal server error" })
    }
}

export async function removeItemFromSearchHistory(req, res) {
    // console.log(req.params)
    let { uniqueId } = req.params

    uniqueId = parseInt(uniqueId);

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                searchHistory: { uniqueId: uniqueId }
            }
        })
        res.status(200).json({ success: true, message: "Item removed from search history" })
    } catch (error) {
        console.log("Error in removeItemFromSearchHistory controller: ", error.message)
        res.status(400).json({ success: false, message: "Internal Server Error" })
    }
}