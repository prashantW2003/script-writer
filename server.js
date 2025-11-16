import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Setup ESM dir/utils
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend (index.html inside public/)
app.use(express.static(path.join(__dirname, "public")));

app.post("/generate", async (req, res) => {
    try {
        const { prompt } = req.body;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            system_instruction: {
                parts: [{ text: "You are a horror scriptwriter. Start with FADE IN: and end with FADE OUT." }]
            }
        };

        const r = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await r.json();
        res.send(data);

    } catch (err) {
        res.status(500).send({
            error: "API failed",
            details: err.message
        });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port", process.env.PORT || 5000);
});
