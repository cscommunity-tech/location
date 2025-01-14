require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Google Places API Base URL
const GOOGLE_PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place";

// Proxy route for autocomplete
app.get("/places/autocomplete", async (req, res) => {
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
});

app.get("/", (req, res) => {
    res.write('hello from node js');
    res.end();  // Corrected: added parentheses to call res.end
});


// Proxy route for place details
app.get("/places/details", async (req, res) => {
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
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
