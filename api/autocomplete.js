import axios from 'axios';

export default async function handler(req, res) {
    const { input } = req.query;

    if (!input) {
        return res.status(400).json({ error: "Input query parameter is required" });
    }

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
            {
                params: {
                    input,
                    key: process.env.GOOGLE_API_KEY,
                },
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching autocomplete results:", error.message);
        res.status(500).json({ error: "Failed to fetch autocomplete results" });
    }
}
