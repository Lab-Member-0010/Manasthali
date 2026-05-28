import dotenv from "dotenv";
import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

dotenv.config();

export const MentalCoach = asyncHandler(async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question is required!" });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const data = {
            contents: [{ parts: [{ text: question }] }],
        };

        const response = await axios.post(url, data, {
            headers: { "Content-Type": "application/json" },
        });

        if (
            response.data &&
            response.data.candidates &&
            response.data.candidates.length > 0
        ) {
            res.json({ answer: response.data.candidates[0].content.parts[0].text });
        } else {
            res.json({ answer: "No response from AI" });
        }
    } catch (error) {
        logger.error(
            "AI Error:",
            error.response ? error.response.data : error.message
        );
        res.status(500).json({ error: "AI Server Error" });
    }
});
