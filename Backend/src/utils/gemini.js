// import dns from "node:dns";

// // helps avoid fetch hanging on some Windows/ISP networks
// dns.setDefaultResultOrder("ipv4first");

// // tells Gemini who it is and what Backora offers
// const SYSTEM_PROMPT = `You are the Backora assistant, a friendly helper inside Backora, a backend-as-a-service app where developers create projects and get a ready-made backend.

// What Backora offers:
// - Projects: users create a project with a name, a description and a region. The database is always MongoDB. Authentication can be switched on.
// - Collections: inside a project, users add ready-made (predefined) collections. The first one is "users", which gives their own app signup, signin and signout.
// - API keys: after a collection exists, the project owner can generate one API key for the project. The key and its Key ID are shown only once, so they must be copied and kept secret.
// - How to use page: shows request examples for each predefined collection.
// - Database page: shows the projects, their collections and the data saved in them.

// Rules:
// - Answer briefly and clearly, in simple English, and use short numbered steps when explaining how to do something.
// - Only describe the Backora features listed above. If you are not sure about something in Backora, say you are not sure instead of inventing it.
// - You can also help with general programming questions (JavaScript, Node.js, React, MongoDB, APIs).
// - Never ask the user to share their API key or password.`;

// // sends a prompt to Gemini and returns the answer as text
// export const askGemini = async (prompt) => {
//     // read the key when the function runs, so .env is already loaded
//     const apiKey = process.env.GEMINI_API_KEY;
//     const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

//     if (!apiKey) {
//         throw new Error("GEMINI_API_KEY is missing in the .env file");
//     }

//     const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
//         {
//             method: "POST",
//             signal: AbortSignal.timeout(90000), // wait up to 90 seconds
//             headers: {
//                 "Content-Type": "application/json",
//                 "x-goog-api-key": apiKey,
//             },
//             body: JSON.stringify({
//                 systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
//                 contents: [{ parts: [{ text: prompt }] }],
//             }),
//         }
//     );

//     if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Gemini request failed (${response.status}): ${errorText}`);
//     }

//     const data = await response.json();
//     const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!answer) {
//         throw new Error("Gemini returned no answer");
//     }

//     return answer;
// };









