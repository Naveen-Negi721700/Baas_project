// use the same import lines (names and paths) as at the top of auth.controllers.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";

import { askGemini } from "../utils/gemini.js";

const askAI = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
        throw new apiErrors(400, "Prompt is required");
    }

    // every call uses your Gemini quota, so keep the prompt a sensible size
    if (prompt.length > 2000) {
        throw new apiErrors(400, "Prompt is too long (maximum 2000 characters)");
    }

    let answer;

    try {
        answer = await askGemini(prompt.trim());
    } catch (error) {
        // the real reason stays in the server log, the user gets a simple message
        console.error("Gemini error:", error.message);
        throw new apiErrors(502, "Could not get an answer from the AI. Please try again.");
    }

    return res.status(200).json(
        new apiResponce(200, { answer }, "AI answered successfully")
    );
});

export { askAI };