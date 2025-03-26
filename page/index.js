import { useState } from "react";
import axios from "axios";

export default function Home() {
    const [query, setQuery] = useState(""); // State to store user input
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTweets = async () => {
        if (!query) {
            setError("Please enter a search term.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`https://your-deployed-api.com/sentiment?query=${query}`);
            setTweets(response.data);
        } catch (err) {
            setError("Failed to fetch sentiment analysis. Try again later.");
            console.error("Error fetching tweets", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Twitter Sentiment Analysis</h1>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter keyword (e.g., 'Bitcoin')"
            />
            <button onClick={fetchTweets} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Sentiment"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {tweets.map((tweet, index) => (
                    <li key={index}>
                        {tweet.sentiment === "positive" ? "😊" : tweet.sentiment === "negative" ? "😡" : "😐"}{" "}
                        {tweet.tweet}
                    </li>
                ))}
            </ul>
        </div>
    );
}
