import dns from "node:dns";

// helps avoid fetch hanging on some Windows/ISP networks
dns.setDefaultResultOrder("ipv4first");

// ============================================================
// CHECK THESE AGAINST YOUR OWN ROUTES FILE
// The assistant does things by calling your normal API routes,
// with the logged-in user's cookie, so all your checks still run.
// ============================================================
const API_BASE =
    process.env.API_BASE_URL ||
    `http://127.0.0.1:${process.env.PORT || 8000}/api/v1/Baas`;

const ROUTES = {
    listProjects: () => ({ method: "GET", path: "/getProjects" }),
    createProject: () => ({ method: "POST", path: "/createProject" }),
    createCollection: (projectId) => ({ method: "POST", path: `/createCollection/${projectId}` }),
    createApiKey: (projectId) => ({ method: "POST", path: `/createApiKey/${projectId}` }),
};

// the schema of the ready-made "users" collection (same as the create collection page)
const USERS_SCHEMA = {
    name: { type: "String", required: true, unique: false },
    email: { type: "String", required: true, unique: true },
    password: { type: "String", required: true, unique: false },
    avatar: { type: "String", required: false, unique: false },
};

const SYSTEM_PROMPT = `You are the Backora assistant, a friendly helper inside Backora, a backend-as-a-service app where developers create projects and get a ready-made backend.

What Backora offers:
- Projects: users create a project with a name and a description. The database is always MongoDB.
- Collections: inside a project, users add ready-made (predefined) collections. The first one is "users", which gives their own app signup, signin and signout.
- API keys: after a collection exists, the project owner can generate one API key for the project. The key is shown only once, so it must be copied and kept secret.
- How to use page: shows request examples for each predefined collection.
- Database page: shows the projects, their collections and the data saved in them.

You can also DO things for the user with your tools:
- create_project: creates a project.
- add_users_collection: adds the ready-made "users" collection to a project.
- generate_api_key: generates the API key of a project (only one key per project).
- list_projects: lists the user's projects with their ids.

How to act:
- When the user asks you to create something, do it with the tools instead of only explaining how.
- For a whole setup (for example "create a project called todo-list with a collection and an API key"), work in this order: create_project, then add_users_collection with the id that create_project returned, then generate_api_key with the same id.
- If the user did not give a project name, ask for it before creating anything. Never invent a name.
- Only the "users" collection exists right now. If the user asks for another kind of collection, say it is not available yet.
- To use a project that already exists, call list_projects first to find its id. Never guess an id.
- You can never see an API key value. After generating a key, tell the user that their key is ready and that they can copy it from the Collections page. Say the key is shown only once, so they should copy it and keep it secret. Never write a key in your answer.
- If create_project fails, stop there: do not call any other tool and do not invent a project id.
- If a tool returns an error, write the exact error text in quotes, then explain it in simple words and tell the user what they can do.
- You cannot delete or change anything. If the user asks for that, tell them to do it in the app.

Rules:
- Answer briefly and clearly, in simple English, and use short numbered steps when explaining how to do something.
- Only describe the Backora features listed above. If you are not sure about something in Backora, say you are not sure instead of inventing it.
- You can also help with general programming questions (JavaScript, Node.js, React, MongoDB, APIs).
- Never ask the user to share their API key or password.`;

const TOOLS = [
    {
        functionDeclarations: [
            {
                name: "list_projects",
                description: "List the signed-in user's projects with their ids and names.",
                parameters: { type: "OBJECT", properties: {} },
            },
            {
                name: "create_project",
                description: "Create a new Backora project for the signed-in user.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        name: { type: "STRING", description: "The project name, for example todo-list" },
                        description: { type: "STRING", description: "A short description of the project (optional)" },
                    },
                    required: ["name"],
                },
            },
            {
                name: "add_users_collection",
                description: "Add the ready-made users collection (signup, signin, signout) to a project.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        projectId: { type: "STRING", description: "The id of the project" },
                    },
                    required: ["projectId"],
                },
            },
            {
                name: "generate_api_key",
                description: "Generate the API key of a project. A project can have only one key.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        projectId: { type: "STRING", description: "The id of the project" },
                    },
                    required: ["projectId"],
                },
            },
        ],
    },
];

// calls one of your own API routes as the logged-in user
const callApi = async ({ method, path }, body, cookie) => {
    const response = await fetch(`${API_BASE}${path}`, {
        method,
        signal: AbortSignal.timeout(30000),
        headers: {
            "Content-Type": "application/json",
            cookie: cookie || "",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();

    let json = null;
    try {
        json = JSON.parse(text);
    } catch (error) {
        // the backend sent an html error page
    }

    if (!response.ok) {
        const message =
            json?.message ||
            text.match(/Error: ([^<]+)/)?.[1]?.trim() ||
            text.match(/Cannot (?:GET|POST|PUT|PATCH|DELETE) [^<\s]+/)?.[0] ||
            `Request failed (${response.status})`;

        throw new Error(message);
    }

    return json?.data;
};

// ids must look like a mongodb id
const checkId = (id) => {
    if (typeof id !== "string" || !/^[a-f0-9]{24}$/i.test(id)) {
        throw new Error("Invalid project id");
    }
    return id;
};

// runs one tool; "effects" collects what really happened, so the frontend can use it
const runTool = async (name, args, cookie, effects) => {
    switch (name) {
        case "list_projects": {
            const projects = await callApi(ROUTES.listProjects(), null, cookie);

            return {
                projects: (projects || []).map((p) => ({ id: p._id, name: p.name })),
            };
        }

        case "create_project": {
            const projectName = String(args.name || "").trim();

            if (!projectName || projectName.length > 60) {
                throw new Error("The project name must be 1 to 60 characters");
            }

            const description =
                String(args.description || "").trim().slice(0, 300) ||
                "Created by the Backora assistant";

            const project = await callApi(
                ROUTES.createProject(),
                // your createProject controller reads the project name from "title"
                { title: projectName, description },
                cookie
            );

            effects.push({ type: "project", project });

            return { success: true, id: project._id, name: project.name };
        }

        case "add_users_collection": {
            const projectId = checkId(args.projectId);

            await callApi(
                ROUTES.createCollection(projectId),
                { name: "users", schema: USERS_SCHEMA },
                cookie
            );

            effects.push({ type: "collection", projectId, name: "users" });

            return { success: true, collection: "users" };
        }

        case "generate_api_key": {
            const projectId = checkId(args.projectId);

            const data = await callApi(
                ROUTES.createApiKey(projectId),
                { name: "My API Key", type: "secret" },
                cookie
            );

            // the secret goes straight to the user's browser, it is NEVER sent to Gemini
            effects.push({
                type: "apiKey",
                projectId,
                keyId: data.keyId,
                value: data.apiKeyValue,
            });

            return {
                success: true,
                note: "The key was created and delivered to the user securely. Do not write the key in your answer.",
            };
        }

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
};

const callGemini = async (contents) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing in the .env file");
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
            method: "POST",
            signal: AbortSignal.timeout(90000),
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                tools: TOOLS,
                contents,
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini request failed (${response.status}): ${errorText}`);
    }

    return response.json();
};

// history = the earlier messages, as [{ role: "user" | "assistant", text }]
export const runAssistant = async ({ prompt, history = [], cookie }) => {
    // the conversation must start with a user message
    const past = [...history];
    while (past.length > 0 && past[0].role !== "user") past.shift();

    const contents = [
        ...past.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.text }],
        })),
        { role: "user", parts: [{ text: prompt }] },
    ];

    const effects = [];

    // Gemini asks for a tool, we run it, we send the result back, until it gives the final answer
    for (let step = 0; step < 6; step++) {
        const data = await callGemini(contents);
        const parts = data.candidates?.[0]?.content?.parts || [];
        const calls = parts.filter((p) => p.functionCall);

        if (calls.length === 0) {
            const answer = parts
                .filter((p) => p.text && !p.thought)
                .map((p) => p.text)
                .join("")
                .trim();

            if (!answer) {
                throw new Error("Gemini returned no answer");
            }

            return { answer, effects };
        }

        // keep the model's own turn exactly as it came
        contents.push({ role: "model", parts });

        const responses = [];

        for (const { functionCall } of calls) {
            let result;

            try {
                result = await runTool(functionCall.name, functionCall.args || {}, cookie, effects);
            } catch (error) {
                console.error(`Assistant tool "${functionCall.name}" failed:`, error.message);
                result = { error: error.message };
            }

            responses.push({
                functionResponse: { name: functionCall.name, response: result },
            });
        }

        contents.push({ role: "user", parts: responses });
    }

    return {
        answer: "I could not finish that. Please try again.",
        effects,
    };
};