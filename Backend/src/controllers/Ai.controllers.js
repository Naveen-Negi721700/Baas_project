import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";

import { runAssistant } from "../utils/assistant.js";

const askAI = asyncHandler(async (req, res) => {
    const { prompt, history, context } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
        throw new apiErrors(400, "Prompt is required");
    }

    // every call uses your Gemini quota, so keep the prompt a sensible size
    if (prompt.length > 2000) {
        throw new apiErrors(400, "Prompt is too long (maximum 2000 characters)");
    }

    // only keep the last few valid messages of the conversation
    const cleanHistory = Array.isArray(history)
        ? history
            .filter(
                (m) =>
                    m &&
                    (m.role === "user" || m.role === "assistant") &&
                    typeof m.text === "string" &&
                    m.text.trim()
            )
            .slice(-8)
            .map((m) => ({ role: m.role, text: m.text.slice(0, 1500) }))
        : [];

    // the project the user has open, so "this project" makes sense
    let selectedProject = null;
    const sp = context?.selectedProject;

    if (sp && typeof sp.id === "string" && /^[a-f0-9]{24}$/i.test(sp.id)) {
        selectedProject = {
            id: sp.id,
            name: String(sp.name || "").replace(/[\r\n`]/g, " ").slice(0, 60),
        };
    }

    let result;

    try {
        result = await runAssistant({
            prompt: prompt.trim(),
            history: cleanHistory,
            // the assistant acts as this user, using their own login cookie
            cookie: req.headers.cookie,
            selectedProject,
        });
    } catch (error) {
        // the real reason stays in the server log, the user gets a simple message
        console.error("Assistant error:", error.message);
        throw new apiErrors(502, "Could not get an answer from the AI. Please try again.");
    }

    // result = { answer, effects }
    return res.status(200).json(
        new apiResponce(200, result, "AI answered successfully")
    );
});

export { askAI };




// // use the same import lines (names and paths) as at the top of auth.controllers.js
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { apiErrors } from "../utils/apiError.js";
// import { apiResponce } from "../utils/apiResponce.js";

// import { runAssistant } from "../utils/assistant.js";

// const askAI = asyncHandler(async (req, res) => {
//     const { prompt, history } = req.body;

//     if (typeof prompt !== "string" || !prompt.trim()) {
//         throw new apiErrors(400, "Prompt is required");
//     }

//     // every call uses your Gemini quota, so keep the prompt a sensible size
//     if (prompt.length > 2000) {
//         throw new apiErrors(400, "Prompt is too long (maximum 2000 characters)");
//     }

//     // only keep the last few valid messages of the conversation
//     const cleanHistory = Array.isArray(history)
//         ? history  
//             .filter(
//                 (m) =>
//                     m &&
//                     (m.role === "user" || m.role === "assistant") &&
//                     typeof m.text === "string" &&
//                     m.text.trim()
//             )
//             .slice(-8)
//             .map((m) => ({ role: m.role, text: m.text.slice(0, 1500) }))
//         : [];

//     let result;

//     try {
//         result = await runAssistant({
//             prompt: prompt.trim(),
//             history: cleanHistory,
//             // the assistant acts as this user, using their own login cookie
//             cookie: req.headers.cookie,
//         });
//     } catch (error) {
//         // the real reason stays in the server log, the user gets a simple message
//         console.error("Assistant error:", error.message);
//         throw new apiErrors(502, "Could not get an answer from the AI. Please try again.");
//     }

//     // result = { answer, effects }
//     return res.status(200).json(
//         new apiResponce(200, result, "AI answered successfully")
//     );
// });

// export { askAI };