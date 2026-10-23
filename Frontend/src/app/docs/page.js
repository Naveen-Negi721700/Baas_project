"use client";

import React, { useState } from "react";
import Link from "next/link";

// Base URL of your backend
const BASE =
    process.env.NEXT_PUBLIC_FETCH_URI ||
    "http://127.0.0.1:8000/api/v1/Baas";

// Predefined collections and their API documentation
const docs = [
    {
        key: "users",
        title: "users",
        short: "User accounts",
        desc: "Add signup, signin and signout to your own app using this collection.",


     
endpoints: [

     {
        id: "register",
        title: "Register User",
        method: "POST",
        path: "/public/register/YOUR_COLLECTION_ID",
        desc: "Create a new user in your collection.",

        body: {
            name: "John",
            email: "user@example.com",
            password: "123456",
        },

        response: {
            statusCode: 201,
            data: {
                _id: "USER_ID",
                name: "John",
                email: "user@example.com",
            },
            message: "Registered successfully",
            success: true,
        },
    },
    
    {
        id: "loginUser",
        title: "Login User",
        method: "POST",
        path: "/public/loginUser/YOUR_COLLECTION_ID",
        desc: "Log a user in with their email and password.",

        body: {
            email: "user@example.com",
            password: "123456",
        },

        response: {
            statusCode: 200,
            data: {
                _id: "USER_ID",
                name: "John",
                email: "user@example.com",
            },
            message: "Logged in successfully",
            success: true,
        },
    },

   

    {
        id: "logoutUser",
        title: "Logout User",
        method: "POST",
        path: "/public/logoutUser/YOUR_COLLECTION_ID",
        desc: "Log the current user out.",

        body: null,

        response: {
            statusCode: 200,
            data: {},
            message: "Logged out successfully",
            success: true,
        },
    },

    {
        id: "getCurrentUser",
        title: "Get Current User",
        method: "GET",
        path: "/public/getCurrentUser/YOUR_COLLECTION_ID",
        desc: "Get the details of the currently logged-in user.",

        body: null,

        response: {
            statusCode: 200,
            data: {
                _id: "USER_ID",
                name: "John",
                email: "user@example.com",
            },
            message: "User fetched successfully",
            success: true,
        },
    },

    {
        id: "refreshAccessToken",
        title: "Refresh Access Token",
        method: "POST",
        path: "/public/refreshAccessToken/YOUR_COLLECTION_ID",
        desc: "Refresh the access token when it expires, if your backend supports token refresh.",

        body: null,

        response: {
            statusCode: 200,
            data: {
                accessToken: "NEW_ACCESS_TOKEN",
            },
            message: "Access token refreshed successfully",
            success: true,
        },
    },
],



    },
];

// Build example fetch code for each endpoint
const makeCode = (e) => `fetch("${BASE}${e.path}", {
  method: "${e.method}",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY",
    "x-api-key-id": "YOUR_API_KEY_ID",
  },${e.body
        ? `
  body: JSON.stringify(${JSON.stringify(e.body, null, 2)}),`
        : ""
    }
})
  .then((res) => res.json())
  .then((data) => console.log(data));`;

const HowToUse = () => {
    const [selectedKey, setSelectedKey] = useState(null);
    const [active, setActive] = useState("start");

    // Find the selected collection
    const selected = docs.find((c) => c.key === selectedKey);

    // Select or deselect a collection
    const handleSelect = (key) => {
        setSelectedKey((previousKey) =>
            previousKey === key ? null : key
        );

        setActive("start");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Scroll to a section on the same page
    const handleScroll = (id) => {
        setActive(id);

        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div className="min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_50%_at_60%_0%,rgba(190,40,80,0.30),transparent_70%)] text-white flex flex-col lg:flex-row">

            {/* Box 1: Predefined collections */}
            <aside className="relative z-[45] lg:sticky lg:top-0 lg:h-screen lg:self-start lg:w-56 shrink-0 bg-black/70 border-b lg:border-b-0 lg:border-r border-white/10 p-3 text-sm lg:overflow-y-auto">

                <p className="text-[11px] font-semibold text-white/40 px-3 mt-3 mb-2">
                    PREDEFINED COLLECTIONS
                </p>

                {docs.map((c) => (
                    <button
                        key={c.key}
                        onClick={() => handleSelect(c.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-left ${selectedKey === c.key
                            ? "bg-pink-500/15 text-pink-400"
                            : "hover:bg-white/5"
                            }`}
                    >
                        <svg
                            className="w-4 h-4 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>

                        <span>{c.title}</span>
                    </button>
                ))}

                <Link
                    href="/collection"
                    className="block text-xs text-white/50 hover:text-white px-3 mt-6 pt-4 border-t border-white/10"
                >
                    ← Back to collections
                </Link>
            </aside>

            {/* Box 2: Features of the selected collection */}
            {selected && (
                <aside className="relative z-[45] lg:sticky lg:top-0 lg:h-screen lg:self-start lg:w-64 shrink-0 bg-black/50 border-b lg:border-b-0 lg:border-r border-white/10 p-3 text-sm lg:overflow-y-auto">

                    <p className="text-[11px] font-semibold text-white/40 px-3 mt-3 mb-1">
                        {selected.title.toUpperCase()}
                    </p>

                    <p className="text-white/50 text-xs px-3 mb-3">
                        {selected.short}
                    </p>

                    <button
                        onClick={() => handleScroll("start")}
                        className={`w-full text-left px-3 py-2 border-l-2 ${active === "start"
                            ? "border-pink-500 text-pink-400 bg-pink-500/10"
                            : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        Before you start
                    </button>

                    {selected.endpoints.map((e) => (
                        <button
                            key={e.id}
                            onClick={() =>
                                handleScroll(`${selected.key}-${e.id}`)
                            }
                            className={`w-full text-left px-3 py-2 border-l-2 ${active === `${selected.key}-${e.id}`
                                ? "border-pink-500 text-pink-400 bg-pink-500/10"
                                : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {e.title}
                        </button>
                    ))}
                </aside>
            )}

            {/* Main documentation content */}
            <main className="flex-1 min-w-0 px-4 sm:px-8 py-8">
                <div className="max-w-4xl mx-auto">

                    <h1 className="text-3xl font-semibold">
                        How to use{" "}
                        {selected && (
                            <span className="text-pink-500">
                                {selected.title}
                            </span>
                        )}
                    </h1>

                    <p className="text-white/60 text-sm mt-2">
                        {selected
                            ? selected.desc
                            : "Pick a predefined collection on the left to see how to use it in your app."}
                    </p>

                    {/* Before you start */}
                    <section
                        id="start"
                        className="scroll-mt-6 bg-black/60 border border-white/10 rounded-2xl p-6 mt-6"
                    >
                        <h2 className="text-xl font-semibold">
                            Before you start
                        </h2>

                        <p className="text-white/60 text-sm mt-2">
                            You need three values, which you can copy from
                            the Collections page after generating your API key.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-sm">

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <p className="font-medium">API key</p>

                                <p className="text-white/50 text-xs mt-1">
                                    Starts with sk_ and goes in the{" "}
                                    <span className="font-mono text-pink-300">
                                        x-api-key
                                    </span>{" "}
                                    header.
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <p className="font-medium">Key ID</p>

                                <p className="text-white/50 text-xs mt-1">
                                    Identifies your key. Keep it with your key.
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <p className="font-medium">Collection ID</p>

                                <p className="text-white/50 text-xs mt-1">
                                    Replaces{" "}
                                    <span className="font-mono text-pink-300">
                                        YOUR_COLLECTION_ID
                                    </span>{" "}
                                    in the URLs below.
                                </p>
                            </div>
                        </div>

                        <p className="text-white/50 text-xs mt-4">
                            Base URL
                        </p>

                        <pre className="bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-xs text-pink-300 font-mono overflow-x-auto">
                            {BASE}
                        </pre>
                    </section>

                    {/* Endpoint documentation */}
                    {selected &&
                        selected.endpoints.map((e) => (
                            <section
                                key={e.id}
                                id={`${selected.key}-${e.id}`}
                                className="scroll-mt-6 bg-black/60 border border-white/10 rounded-2xl p-6 mt-5"
                            >
                                <h2 className="text-xl font-semibold">
                                    {e.title}
                                </h2>

                                <p className="text-white/60 text-sm mt-1">
                                    {e.desc}
                                </p>

                                {/* HTTP method and endpoint URL */}
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mt-4 font-mono text-xs overflow-x-auto">
                                    <span className="bg-pink-500/15 text-pink-300 rounded-md px-2 py-0.5 font-semibold">
                                        {e.method}
                                    </span>

                                    <span className="whitespace-nowrap">
                                        {BASE}
                                        {e.path}
                                    </span>
                                </div>

                                {/* Headers */}
                                <p className="text-white/50 text-xs mt-4">
                                    Headers
                                </p>

                                <pre className="bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-xs text-pink-300 font-mono overflow-x-auto">
                                    {`Content-Type: application/json
x-api-key: YOUR_API_KEY  
x-api-key-id: YOUR_API_KEY_ID`}
                                </pre>

                                {/* Request body */}
                                {e.body && (
                                    <>
                                        <p className="text-white/50 text-xs mt-4">
                                            Request body
                                        </p>

                                        <pre className="bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-xs text-pink-300 font-mono overflow-x-auto">
                                            {JSON.stringify(
                                                e.body,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </>
                                )}

                                {/* Example fetch code */}
                                <p className="text-white/50 text-xs mt-4">
                                    Example code
                                </p>

                                <pre className="bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-xs text-pink-300 font-mono overflow-x-auto">
                                    {makeCode(e)}
                                </pre>

                                {/* Example response */}
                                <p className="text-white/50 text-xs mt-4">
                                    Example response
                                </p>

                                <pre className="bg-white/5 border border-white/10 rounded-xl p-3 mt-1 text-xs text-pink-300 font-mono overflow-x-auto">
                                    {JSON.stringify(
                                        e.response,
                                        null,
                                        2
                                    )}
                                </pre>
                            </section>
                        ))}

                </div>
            </main>
        </div>
    );
};

export default HowToUse;
