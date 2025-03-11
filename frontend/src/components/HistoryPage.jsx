import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import axios from "axios"
import { SMALL_IMAGE_BASE_URL } from "../Utils/constants"
import { Trash } from "lucide-react";
import toast from 'react-hot-toast'


function formatDate(dateString) {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    // Format: MM/DD/YYYY
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

export const HistoryPage = () => {
    const [searchHistory, setSearchHistory] = useState([])

    useEffect(() => {
        const getSearchHistory = async () => {
            try {
                const res = await axios.get(`/api/v1/search/history`)
                setSearchHistory(res.data.content)
            } catch (error) {
                console.log(error)
                setSearchHistory([])
            }
        }
        getSearchHistory()
    }, [])

    const handleDelete = async (history) => {

        try {
            await axios.delete(`/api/v1/search/history/${history.id}`)
            setSearchHistory(searchHistory.filter((item) => item.uniqueId !== history.uniqueId))
        } catch (error) {
            toast.error("Failed to delete search item")
            console.log(error)
        }
    }

    if (searchHistory?.length === 0) {
        return (
            <div className="bg-black min-h-screen text-white">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Search History</h1>
                    <div className="flex justify-center items-center h-96">
                        <p className="text-xl">No Search History Found</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Search History</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchHistory?.map((entry) => (
                        <div key={entry.uniqueId} className="bg-gray-800 p-4 flex items-start">
                            <img src={SMALL_IMAGE_BASE_URL + entry.image} alt="History Image" className="size-16 rounded-full object-cover mr-4" />
                            <div className="flex flex-col items-start">
                                <span className="text-lg">{entry.title}</span>
                                <span className="text-lg">{formatDate(entry.createdAt)}</span>
                            </div>
                            <span className={` min-w-20 px-3 py-1 rounded-full text-center text-sm ml-auto 
                            ${entry.searchType === "movie" ? 'bg-red-600' : entry.searchType === "tv" ? "bg-blue-600" : "bg-green-600"

                                }`}>{entry.searchType[0].toUpperCase() + entry.searchType.slice(1)}</span>
                            <Trash className="size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600" onClick={() => handleDelete(entry)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}