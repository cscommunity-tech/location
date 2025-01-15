import axios from 'axios';

const GOOGLE_PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place";

export default async function handler(req, res) {
    const { place_id } = req.query;

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

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching place details:", error.message);
        res.status(500).json({ error: "Failed to fetch place details" });
    }
}
