import { useEffect, useState } from "react";

import axios from "axios";
import { useContentStore } from "../Store/content.js";

const useGetTrendingContent = () => {
    const [trendingContent, setTrendingContent] = useState(null);
    const { contentType } = useContentStore();
    // console.log("Content type outside useEffect", contentType)

    useEffect(() => {
        // console.log("useEffect triggered with contentType:", contentType);
        // setTrendingContent(null)
        const getTrendingContent = async () => {
            try {
                // console.log("Fetching data...");
                const res = await axios.get(`/api/v1/${contentType}/trending`);
                // console.log("Fetched URL:", `/api/v1/${contentType}/trending`);
                setTrendingContent(res.data.content);
            } catch (error) {
                console.error("Error in useEffect:", error);
            }
        };

        getTrendingContent();
    }, [contentType]);

    return { trendingContent };
};
export default useGetTrendingContent;