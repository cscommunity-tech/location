const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/autocomplete", async (req, res) => {
    const { input } = req.query;

    if (!input) {
        return res.status(400).json({ error: "Input query is required" });
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

        res.json(response.data.predictions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch autocomplete suggestions" });
    }
});

app.get("/details", async (req, res) => {
    const { place_id } = req.query;

    if (!place_id) {
        return res.status(400).json({ error: "Place ID is required" });
    }

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json`,
            {
                params: {
                    place_id,
                    key: process.env.GOOGLE_API_KEY,
                },
            }
        );

        const { lat, lng } = response.data.result.geometry.location;
        res.json({ lat, lng });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch place details" });
    }
});

module.exports = app;
