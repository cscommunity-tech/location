const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Autocomplete endpoint
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

// Place details endpoint
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

// Reverse Geocoding endpoint (Latitude & Longitude to Address)
app.get("/reverse-geocode", async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            {
                params: {
                    latlng: `${lat},${lng}`,
                    key: process.env.GOOGLE_API_KEY,
                },
            }
        );

        if (response.data.results.length === 0) {
            return res.status(404).json({ error: "No address found for the given coordinates" });
        }

        const address = response.data.results[0].formatted_address;
        res.json({ address });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch address" });
    }
});

// VIN Decode endpoint
app.get("/vin-decode", async (req, res) => {
    const { vin } = req.query;

    if (!vin) {
        return res.status(400).json({ error: "VIN parameter is required" });
    }

    try {
        const API_URL = `https://auto.dev/api/vin/${vin}`;
        const API_KEY = "ZrQEPSkKa29ucmFkemFybm93c2tpQHV0ZXhhcy5lZHU=";

        const response = await axios.get(API_URL, {
            headers: {
                "Content-Type": "application/json",
                "apikey": API_KEY,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch VIN data",
            message: error.message,
        });
    }
});

// Export the app for Vercel
module.exports = app;
