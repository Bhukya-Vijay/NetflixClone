import { useState } from "react"
import Navbar from "./Navbar"
import { useContentStore } from "./Store/content.js"
import { Search } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"
import toast from 'react-hot-toast'
import { ORIGINAL_IMAGE_BASE_URL } from "../Utils/constants.js"

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState("movie")
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState([])
    const { setContentType } = useContentStore()

    const handleTabClick = (tab) => {
        setActiveTab(tab)
        tab === "movie" ? setContentType("movie") : setContentType("tv")
        setResults([])
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            // console.log(`/api/v1/search/${activeTab}/${searchTerm}`)
            const res = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`)
            // console.log(res)
            setResults(res.data.content)
        } catch (error) {
            if (error.response.status === 404) {
                toast.error("Nothing Found, make sure you are searching under the right category")
            } else {
                toast.error("An error Occured, Please try again later")
            }

        }

    }

    console.log("search Results", results)

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />
            <div className="container mx-auto px-4 py/8 ">
                <div className="flex justify-center gap-3 mb-4">
                    <button className={`${activeTab === "movie" ? 'bg-red-600' : 'bg-gray-800'} hover:bg-red-700 p-1 rounded-sm px-4 py-2`}
                        onClick={() => handleTabClick("movie")}>Movies</button>
                    <button className={`${activeTab === "tv" ? 'bg-red-600' : 'bg-gray-800'} hover:bg-red-700 p-1 rounded-sm px-4 py-2`}
                        onClick={() => handleTabClick("tv")}>Tv</button>
                    <button className={`${activeTab === "person" ? 'bg-red-600' : 'bg-gray-800'} hover:bg-red-700 p-1 rounded-sm px-4 py-2`}
                        onClick={() => handleTabClick("person")}>Person</button>
                </div>
                <form className="flex gap-2 items-stretch mx-auto max-w-2xl" onSubmit={handleSearch}>
                    <input type="text"
                        className="bg-gray-800 w-full p-2 text-white"
                        placeholder={"Search for a " + activeTab}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                    <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                        <Search className="size-6" />
                    </button>
                </form>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
                    {results.map((result) => {
                        if (!result.poster_path && !result.profile_path) return null;
                        // console.log("Link to: ", activeTab === "person" ? `/actor/${result.name}` : `/watch/${result.id}`)

                        return (
                            <div key={result.id} className='bg-gray-800 p-4 rounded'>

                                {activeTab === "person" ?
                                    (
                                        <Link to={"/actor/" + result.name} className='flex flex-col items-center'
                                            onClick={setContentType(activeTab)}>
                                            <img
                                                src={ORIGINAL_IMAGE_BASE_URL + result.profile_path}
                                                alt={result.name}
                                                className='max-h-96 rounded mx-auto'
                                            />
                                            <h2 className='mt-2 text-xl font-bold'>{result.name}</h2>
                                        </Link>
                                    ) : (
                                        <Link to={"/watch/" + result.id} className="flex flex-col" onClick={() => setContentType(activeTab)}>
                                            <img src={ORIGINAL_IMAGE_BASE_URL + result.poster_path} alt="movie poster" />
                                            <h2>{result.title || result.name}</h2>
                                        </Link>
                                    )
                                }
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default SearchPage