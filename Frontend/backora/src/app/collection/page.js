
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/lib/api";
import { useProject } from "../context/projectContext";

// Convert a date into a readable relative time.
const timeAgo = (date) => {
    if (!date) return "Unknown";

    const timestamp = new Date(date).getTime();

    if (Number.isNaN(timestamp)) return "Unknown";

    const seconds = Math.max(
        0,
        Math.floor((Date.now() - timestamp) / 1000)
    );

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour ago`;
    if (seconds < 172800) return "Yesterday";

    return `${Math.floor(seconds / 86400)} days ago`;
};

const Collections = () => {
    const { projectId, isReady } = useProject();

    const [search, setSearch] = useState("");
    const [collection, setCollection] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [apiKey, setApiKey] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState("");
    const [hasKey, setHasKey] = useState(false);

    // Fetch collections for the selected project.
    useEffect(() => {
        if (!isReady) return;

        let cancelled = false;

        const fetchCollections = async () => {
            if (!projectId) {
                setCollection([]);
                setError("");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const res = await api.get(
                    `/getCollections/${projectId}`
                );

                if (cancelled) return;

                setCollection(res.data.data || []);
            } catch (err) {
                if (cancelled) return;

                const data = err.response?.data;

                const message =
                    typeof data === "string"
                        ? data
                        : data?.message || "";

                // A new project may not have any collections.
                const isEmpty =
                    err.response?.status === 404 ||
                    message.toLowerCase().includes("no collections found");

                if (isEmpty) {
                    setCollection([]);
                    setError("");
                } else {
                    console.error(
                        "Error fetching collections:",
                        data || err.message
                    );

                    setCollection([]);
                    setError(message || "Failed to fetch collections.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchCollections();

        return () => {
            cancelled = true;
        };
    }, [projectId, isReady]);

    // Restore this project's saved API-key information.
    useEffect(() => {
        if (!isReady) return;

        if (!projectId) {
            setHasKey(false);
            setApiKey(null);
            return;
        }

        setHasKey(
            localStorage.getItem(`apiKeyCreated_${projectId}`) === "true"
        );

        try {
            const saved = localStorage.getItem(
                `apiKeyData_${projectId}`
            );

            setApiKey(saved ? JSON.parse(saved) : null);
        } catch (err) {
            console.error("Could not restore saved API key:", err);

            localStorage.removeItem(`apiKeyData_${projectId}`);
            setApiKey(null);
        }
    }, [projectId, isReady]);

    // Generate an API key for this project.
    const handleGenerateKey = async () => {
        if (!projectId || generating || hasKey) return;

        try {
            setGenerating(true);
            setError("");
            setCopied("");

            const res = await api.post(
                `/createApiKey/${projectId}`,
                {
                    name: "My API Key",
                    type: "secret",
                }
            );

            const data = res.data.data;

            if (!data?.apiKeyValue || !data?.keyId) {
                setError(
                    "The server response is missing the API key or key ID."
                );
                return;
            }

            const newKey = {
                id: data.keyId,
                value: data.apiKeyValue,
            };

            setApiKey(newKey);
            setHasKey(true);

            localStorage.setItem(
                `apiKeyData_${projectId}`,
                JSON.stringify(newKey)
            );

            localStorage.setItem(
                `apiKeyCreated_${projectId}`,
                "true"
            );
        } catch (err) {
            const raw = err.response?.data;

            const message =
                typeof raw === "string"
                    ? raw
                    : raw?.message || "";

            console.error(
                "Error creating API key:",
                raw || err.message
            );

            if (/already/i.test(message)) {
                setHasKey(true);
            }

            setError(message || "Failed to generate API key.");
        } finally {
            setGenerating(false);
        }
    };

    // Hide the displayed key without deleting it on the server.
    const handleCloseKey = () => {
        setApiKey(null);

        if (projectId) {
            localStorage.removeItem(`apiKeyData_${projectId}`);
        }
    };

    // Copy a key or collection ID.
    const handleCopy = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(label);

            setTimeout(() => setCopied(""), 2000);
        } catch (err) {
            console.error("Could not copy to clipboard:", err);
            setError("Could not copy. Please copy the value manually.");
        }
    };

    const filtered = collection.filter((c) =>
        (c.name || "").toLowerCase().includes(search.toLowerCase())
    );

    const totalDocs = collection.reduce(
        (sum, c) => sum + (c.docs ?? 0),
        0
    );

    const totalFields = collection.reduce(
        (sum, c) => sum + Object.keys(c.schema || {}).length,
        0
    );

    if (!isReady || loading) {
        return (
            <div className="min-h-screen bg-[#0b0b0f] text-white p-10">
                Loading collections...
            </div>
        );
    }

    if (!projectId) {
        return (
            <div className="min-h-screen bg-[#0b0b0f] text-white p-10">
                <h1 className="text-2xl font-semibold">
                    No project selected
                </h1>

                <p className="text-white/60 mt-2">
                    Please create or select a project first.
                </p>

                <Link
                    href="/project"
                    className="inline-block mt-5 bg-pink-600 rounded-lg px-5 py-2.5"
                >
                    Create project
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(190,40,80,0.30),transparent_70%)] text-white px-4 py-10">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">
                            Collections
                        </h1>

                        <p className="text-white/60 text-sm mt-2 max-w-xs">
                            Organize and manage your project data.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {collection.length > 0 && !hasKey && (
                            <button
                                onClick={handleGenerateKey}
                                disabled={generating}
                                className="border border-pink-500/60 hover:bg-pink-500/10 disabled:opacity-50 font-medium text-sm rounded-lg px-5 py-2.5"
                            >
                                {generating
                                    ? "Generating..."
                                    : "Generate API key"}
                            </button>
                        )}

                        {hasKey && !apiKey && (
                            <Link
                                href="/docs"
                                className="border border-pink-500/60 hover:bg-pink-500/10 font-medium text-sm rounded-lg px-5 py-2.5"
                            >
                                How to use
                            </Link>
                        )}

                        <Link
                            href="/createCollection"
                            className="text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium text-sm rounded-lg px-5 py-2.5"
                        >
                            + New collection
                        </Link>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm rounded-lg px-4 py-3 mt-6">
                        {error}
                    </p>
                )}

                {/* API key display */}
                {apiKey && (
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 mt-6">
                        <div className="flex justify-between items-start gap-3">
                            <p className="text-sm font-medium">
                                Your API key
                            </p>

                            <button
                                onClick={handleCloseKey}
                                aria-label="Hide API key"
                                className="text-white/50 hover:text-white"
                            >
                                <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>

                        <p className="text-white/50 text-xs mt-3">
                            Key ID
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-1">
                            <p className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-pink-300 break-all">
                                {apiKey.id}
                            </p>

                            <button
                                onClick={() => handleCopy(apiKey.id, "id")}
                                className="border border-white/20 hover:bg-white/10 text-sm rounded-lg px-4 py-2 shrink-0"
                            >
                                {copied === "id" ? "Copied!" : "Copy"}
                            </button>
                        </div>

                        <p className="text-white/50 text-xs mt-4">
                            API key
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-1">
                            <p className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-pink-300 break-all">
                                {apiKey.value}
                            </p>

                            <button
                                onClick={() => handleCopy(apiKey.value, "key")}
                                className="border border-white/20 hover:bg-white/10 text-sm rounded-lg px-4 py-2 shrink-0"
                            >
                                {copied === "key" ? "Copied!" : "Copy"}
                            </button>
                        </div>

                        {collection.map((c) => (
                            <div key={c._id}>
                                <p className="text-white/50 text-xs mt-4">
                                    Collection ID · {c.name}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 mt-1">
                                    <p className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-pink-300 break-all">
                                        {c._id}
                                    </p>

                                    <button
                                        onClick={() =>
                                            handleCopy(c._id, `col-${c._id}`)
                                        }
                                        className="border border-white/20 hover:bg-white/10 text-sm rounded-lg px-4 py-2 shrink-0"
                                    >
                                        {copied === `col-${c._id}`
                                            ? "Copied!"
                                            : "Copy"}
                                    </button>
                                </div>
                            </div>
                        ))}

                        <p className="text-white/50 text-xs mt-3">
                            Keep your secret API key safe. Closing this box
                            hides the key and removes its saved copy from this
                            browser; it does not revoke the key on your server.
                        </p>

                        <Link
                            href="/docs"
                            className="inline-block mt-4 text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium text-sm rounded-lg px-5 py-2.5"
                        >
                            How to use
                        </Link>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                        <p className="text-xs text-white/60">Collections</p>
                        <p className="text-2xl font-medium mt-2">
                            {collection.length}
                        </p>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                        <p className="text-xs text-white/60">Documents</p>
                        <p className="text-2xl font-medium mt-2">
                            {totalDocs}
                        </p>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                        <p className="text-xs text-white/60">Fields</p>
                        <p className="text-2xl font-medium mt-2">
                            {totalFields}
                        </p>
                    </div>
                </div>

                {/* Collections list */}
                <div className="bg-black/60 border border-white/10 rounded-2xl p-5 mt-5">
                    <div className="relative">
                        <svg
                            className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search collections..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-pink-500"
                        />
                    </div>

                    <div className="grid grid-cols-[1fr_60px_90px] gap-3 text-[11px] text-white/50 mt-5 pb-3 border-b border-white/10">
                        <span>COLLECTION</span>
                        <span>DOCS</span>
                        <span>UPDATED</span>
                    </div>

                    {filtered.map((c) => (
                        <Link
                            key={c._id}
                            href={`/collections/${c.name}`}
                            className="grid grid-cols-[1fr_60px_90px] gap-3 items-center py-5 border-b border-white/10 hover:bg-white/5 rounded-lg"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                                        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                                        <path d="M3 12A9 3 0 0 0 21 12" />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="font-medium truncate">
                                        {c.name}
                                    </p>

                                    <p className="text-white/50 text-xs mt-0.5">
                                        {c.isSystem
                                            ? "System collection"
                                            : "Custom collection"}{" "}
                                        · {Object.keys(c.schema || {}).length} fields
                                    </p>
                                </div>
                            </div>

                            <span className="text-sm">{c.docs ?? 0}</span>

                            <span className="text-sm text-white/70">
                                {timeAgo(c.updatedAt)}
                            </span>
                        </Link>
                    ))}

                    {filtered.length === 0 && (
                        <p className="text-center text-white/50 text-sm py-8">
                            {collection.length === 0
                                ? "No collections yet. Click + New collection to add one."
                                : "No collections found."}
                        </p>
                    )}

                    <p className="text-white/50 text-xs mt-4">
                        Select a collection to view its documents and fields.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Collections;
