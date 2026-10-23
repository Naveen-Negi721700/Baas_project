"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "@/app/lib/api";
import { useAuth } from "@/app/context/authContext";
import { useProject } from "../context/projectContext";

// shared settings of every icon
const Icon = ({ children, className = "w-5 h-5" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

// Convert a date into "2 min ago", "1 hour ago", "Yesterday"
const timeAgo = (date) => {
    if (!date) return "Recently";

    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour ago`;
    if (seconds < 172800) return "Yesterday";

    return `${Math.floor(seconds / 86400)} days ago`;
};

// true when the backend only says "nothing found", so we show an empty list instead of an error
const isEmptyError = (err, text) => {
    const data = err.response?.data;
    const body = typeof data === "string" ? data : data?.message || "";

    if (/cannot (get|post)/i.test(body)) return false;

    return err.response?.status === 404 || body.includes(text);
};

const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const Dashboard = () => {
    const { user } = useAuth();
    const { selectedProject, setSelectedProject } = useProject();
    const router = useRouter();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // load all projects, and the collections of every project
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await api.get("/getProjects");
                const list = res.data.data || [];

                const withCollections = await Promise.all(
                    list.map(async (project) => {
                        try {
                            const r = await api.get(`/getCollections/${project._id}`);
                            return { ...project, collections: r.data.data || [] };
                        } catch (err) {
                            // a new project has no collections yet, that is normal
                            if (!isEmptyError(err, "No collections found")) {
                                console.error("Error fetching collections:", err.response?.data || err.message);
                            }
                            return { ...project, collections: [] };
                        }
                    })
                );

                setProjects(withCollections);
            } catch (err) {
                if (isEmptyError(err, "No projects found")) {
                    setProjects([]);
                } else {
                    console.error("Error fetching projects:", err.response?.data || err.message);
                    setError(err.response?.data?.message || "Failed to load your dashboard.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // open a project and go to its collections
    const handleOpen = (project) => {
        setSelectedProject(project);
        router.push("/collection");
    };

    // numbers shown on the dashboard
    const totalCollections = projects.reduce((sum, p) => sum + p.collections.length, 0);
    const totalFields = projects.reduce(
        (sum, p) => sum + p.collections.reduce((s, c) => s + Object.keys(c.schema || {}).length, 0),
        0
    );

    const recent = [...projects]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 4);

    const barMax = Math.max(1, ...projects.map((p) => p.collections.length));

    // the API key flag is saved in this browser when a key is generated
    const hasKey = projects.some(
        (p) => localStorage.getItem(`apiKeyCreated_${p._id}`) === "true"
    );

    const steps = [
        {
            title: "Create a project",
            text: "A project is your own backend.",
            done: projects.length > 0,
            href: "/createProject",
            cta: "Create project",
        },
        {
            title: "Add a collection",
            text: "Pick a ready-made collection, like users.",
            done: totalCollections > 0,
            href: selectedProject ? "/createCollection" : "/project",
            cta: selectedProject ? "Add collection" : "Open a project",
        },
        {
            title: "Generate an API key",
            text: "Connect your own app securely.",
            done: hasKey,
            href: "/collection",
            cta: "Open collections",
        },
    ];

    const doneCount = steps.filter((s) => s.done).length;
    const percent = Math.round((doneCount / steps.length) * 100);

    const stats = [
        {
            label: "Projects",
            value: projects.length,
            hint: "Your backends",
            icon: <Icon><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></Icon>,
        },
        {
            label: "Collections",
            value: totalCollections,
            hint: "Across all projects",
            icon: <Icon><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></Icon>,
        },
        {
            label: "Fields",
            value: totalFields,
            hint: "In your schemas",
            icon: <Icon><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></Icon>,
        },
        {
            label: "Active project",
            value: selectedProject?.name || "None",
            hint: selectedProject ? "Selected right now" : "Open a project below",
            isText: true,
            icon: <Icon><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></Icon>,
        },
    ];

    const actions = [
        {
            title: "Collections",
            text: "Manage your data",
            href: "/collection",
            icon: <Icon><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></Icon>,
        },
        {
            title: "Database",
            text: "Browse saved data",
            href: "/database",
            icon: <Icon><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></Icon>,
        },
        {
            title: "How to use",
            text: "Code examples",
            href: "/howToUse",
            icon: <Icon><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></Icon>,
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0b0f] text-white p-10">
                Loading your dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(190,40,80,0.30),transparent_70%)] text-white px-4 py-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">
                            {greeting()}, <span className="text-pink-500">{user?.username || "there"}</span>
                        </h1>
                        <p className="text-white/60 text-sm mt-2">
                            Here is what is happening in your Backora account.
                        </p>
                    </div>

                    <Link
                        href="/createProject"
                        className="inline-flex items-center gap-2 text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium text-sm rounded-lg px-5 py-3"
                    >
                        <Icon className="w-4 h-4"><path d="M5 12h14" /><path d="M12 5v14" /></Icon>
                        Create project
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <p className="bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm rounded-lg px-4 py-3 mt-6">
                        {error}
                    </p>
                )}

                {/* No projects yet */}
                {projects.length === 0 && !error && (
                    <div className="text-center bg-black/60 border border-white/10 rounded-2xl px-6 py-16 mt-8">
                        <div className="w-16 h-16 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center mx-auto">
                            <Icon className="w-8 h-8"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></Icon>
                        </div>

                        <h2 className="text-2xl font-semibold mt-6">Create your first project</h2>
                        <p className="text-white/60 text-sm mt-2 max-w-md mx-auto">
                            A project gives you a ready-to-use backend with a database, authentication and API keys.
                        </p>

                        <Link
                            href="/createProject"
                            className="inline-block mt-7 text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl font-medium text-sm rounded-lg px-6 py-3"
                        >
                            + Create project
                        </Link>
                    </div>
                )}

                {projects.length > 0 && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                            {stats.map((s) => (
                                <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                                    <div className="flex items-center justify-between text-white/60">
                                        <p className="text-xs">{s.label}</p>
                                        <span className="text-pink-400">{s.icon}</span>
                                    </div>

                                    <p className={`font-medium mt-3 truncate ${s.isText ? "text-lg" : "text-3xl"}`}>{s.value}</p>
                                    <p className="text-white/50 text-xs mt-1">{s.hint}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                            {/* Left: recent projects and chart */}
                            <div className="lg:col-span-2 flex flex-col gap-6">

                                {/* Recent projects */}
                                <div className="bg-black/60 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">Recent projects</h2>
                                        <Link href="/project" className="text-xs text-pink-400 hover:underline">View all →</Link>
                                    </div>

                                    <div className="mt-4 flex flex-col gap-3">
                                        {recent.map((p) => (
                                            <button
                                                key={p._id}
                                                type="button"
                                                onClick={() => handleOpen(p)}
                                                className={`w-full text-left flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors ${
                                                    selectedProject?._id === p._id
                                                        ? "border-pink-500 bg-pink-500/10"
                                                        : "border-white/10 bg-white/5 hover:border-pink-500/60 hover:bg-pink-500/5"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
                                                        <Icon><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></Icon>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">{p.name}</p>
                                                        <p className="text-white/50 text-xs mt-0.5 truncate">
                                                            {p.collections.length} {p.collections.length === 1 ? "collection" : "collections"} · Created {timeAgo(p.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="text-pink-400 text-sm shrink-0">Open →</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Collections per project */}
                                <div className="bg-black/60 border border-white/10 rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold">Collections per project</h2>
                                    <p className="text-white/50 text-xs mt-1">How much each project is set up</p>

                                    <div className="mt-5 flex flex-col gap-4">
                                        {projects.slice(0, 6).map((p) => (
                                            <div key={p._id}>
                                                <div className="flex justify-between text-sm">
                                                    <span className="truncate pr-4">{p.name}</span>
                                                    <span className="text-white/60 shrink-0">{p.collections.length}</span>
                                                </div>

                                                <div className="h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-pink-600 to-rose-500"
                                                        style={{ width: `${(p.collections.length / barMax) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: getting started and quick actions */}
                            <div className="flex flex-col gap-6">

                                {/* Getting started */}
                                <div className="bg-black/60 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">Getting started</h2>
                                        <span className="bg-pink-500/15 text-pink-300 rounded-full px-3 py-1 text-xs">{doneCount} of {steps.length}</span>
                                    </div>

                                    <div className="h-2 rounded-full bg-white/10 mt-4 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-pink-600 to-rose-500 transition-all"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>

                                    <div className="mt-5 flex flex-col gap-4">
                                        {steps.map((s) => (
                                            <div key={s.title} className="flex gap-3">
                                                <div className={`w-6 h-6 shrink-0 rounded-full border flex items-center justify-center mt-0.5 ${s.done ? "bg-pink-500 border-pink-500 text-white" : "border-white/20 text-transparent"}`}>
                                                    <Icon className="w-3.5 h-3.5"><path d="M20 6 9 17l-5-5" /></Icon>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className={`text-sm font-medium ${s.done ? "text-white/50 line-through" : ""}`}>{s.title}</p>
                                                    <p className="text-white/50 text-xs mt-0.5">{s.text}</p>

                                                    {!s.done && (
                                                        <Link href={s.href} className="inline-block text-xs text-pink-400 hover:underline mt-1.5">{s.cta} →</Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick actions */}
                                <div className="bg-black/60 border border-white/10 rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold">Quick actions</h2>

                                    <div className="mt-4 flex flex-col gap-2">
                                        {actions.map((a) => (
                                            <Link
                                                key={a.title}
                                                href={a.href}
                                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:border-pink-500/60 hover:bg-pink-500/5 px-3 py-2.5 transition-colors"
                                            >
                                                <span className="w-9 h-9 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">{a.icon}</span>
                                                <span>
                                                    <span className="block text-sm font-medium">{a.title}</span>
                                                    <span className="block text-xs text-white/50">{a.text}</span>
                                                </span>
                                            </Link>
                                        ))}

                                        {/* Opens the chat popup */}
                                        <button
                                            type="button"
                                            onClick={() => window.dispatchEvent(new Event("open-chat"))}
                                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:border-pink-500/60 hover:bg-pink-500/5 px-3 py-2.5 text-left transition-colors"
                                        >
                                            <span className="w-9 h-9 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
                                                <Icon><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></Icon>
                                            </span>
                                            <span>
                                                <span className="block text-sm font-medium">Ask the assistant</span>
                                                <span className="block text-xs text-white/50">Get help from Gemini</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;