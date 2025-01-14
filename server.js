require("dotenv").config();
const axios = require("axios");

const GOOGLE_PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place";

// Proxy route for autocomplete
module.exports = async (req, res) => {
    const { input, place_id } = req.query;

    if (req.url.startsWith("/places/autocomplete")) {
        if (!input) {
            return res.status(400).json({ error: "Input query parameter is required" });
        }

        try {
            const response = await axios.get(`${GOOGLE_PLACES_API_BASE_URL}/autocomplete/json`, {
                params: {
                    input: input,
                    key: process.env.GOOGLE_API_KEY,
                },
            });

            return res.json(response.data);
        } catch (error) {
            console.error("Error fetching autocomplete results:", error.message);
            return res.status(500).json({ error: "Failed to fetch autocomplete results" });
        }
    }

    if (req.url.startsWith("/places/details")) {
        if (!place_id) {
            return res.status(400).json({ error: "Place ID is required" });
        }

        try {
            const response = await axios.get(`${GOOGLE_PLACES_API_BASE_URL}/details/json`, {
                params: {
                    place_id: place_id,
                    key: process.env.GOOGLE_API_KEY,
                },
            });

            return res.json(response.data);
        } catch (error) {
            console.error("Error fetching place details:", error.message);
            return res.status(500).json({ error: "Failed to fetch place details" });
        }
    }

    return res.status(404).json({ error: "Route not found" });
};
