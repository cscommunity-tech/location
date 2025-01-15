import axios from 'axios';

const GOOGLE_PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place";

export default async function handler(req, res) {
    const { input } = req.query;

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

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching autocomplete results:", error.message);
        res.status(500).json({ error: "Failed to fetch autocomplete results" });
    }
}
