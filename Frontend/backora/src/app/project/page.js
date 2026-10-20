"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useProject } from "../context/projectContext";

// Convert a date into "2 min ago", "1 hour ago", "Yesterday"
const timeAgo = (date) => {
    if (!date) return "Recently";

    const seconds = Math.floor(
        (Date.now() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) return "Just now";
    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)} min ago`;
    }
    if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)} hour ago`;
    }
    if (seconds < 172800) return "Yesterday";

    return `${Math.floor(seconds / 86400)} days ago`;
};

const Projects = () => {
    const { selectedProject, setSelectedProject } = useProject();
    const router = useRouter();

    const [search, setsearch] = useState("");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // the project that is waiting for the delete confirmation
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError("");

                // Use the shared API instance
                const res = await api.get("/getProjects");

                setProjects(res.data.data || []);
            } catch (err) {
                const data = err.response?.data;

                // New users may not have any projects yet
                const isEmpty =
                    err.response?.status === 404 ||
                    (
                        typeof data === "string" &&
                        data.includes("No projects found")
                    ) ||
                    data?.message?.includes("No projects found");

                if (isEmpty) {
                    setProjects([]);
                } else {
                    console.error(
                        "Error fetching projects:",
                        data || err.message
                    );

                    setError(
                        data?.message ||
                        "Failed to fetch projects."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Select a project and open its collections
    const handleSelect = (project) => {
        setSelectedProject(project);
        router.push("/collection");
    };

    // Delete the project after the user confirmed
    const handleDelete = async () => {
        if (!projectToDelete || deleting) return;

        try {
            setDeleting(true);
            setError("");

            await api.delete(`/deleteProject/${projectToDelete._id}`);

            // Remove it from the list
            setProjects((prev) =>
                prev.filter((p) => p._id !== projectToDelete._id)
            );

            // If it was the selected project, clear the selection
            if (selectedProject?._id === projectToDelete._id) {
                setSelectedProject(null);
            }

            // Remove the saved api key info of this project from this browser
            localStorage.removeItem(`apiKeyCreated_${projectToDelete._id}`);
            localStorage.removeItem(`apiKeyData_${projectToDelete._id}`);
        } catch (err) {
            const data = err.response?.data;

            console.error("Error deleting project:", data || err.message);

            setError(
                data?.message ||
                "Failed to delete project."
            );
        } finally {
            setDeleting(false);
            setProjectToDelete(null);
        }
    };

    // Filter projects by name
    const filtered = projects.filter((p) =>
        (p.name || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0b0f] text-white p-10">
                Loading projects...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(190,40,80,0.30),transparent_70%)] text-white px-4 py-10">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">
                            Projects
                        </h1>

                        <p className="text-white/60 text-sm mt-2 max-w-xs">
                            All the backends you have created.
                        </p>
                    </div>

                    <Link
                        href="/createProject"
                        className="text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium text-sm rounded-lg px-5 py-2.5"
                    >
                        + New project
                    </Link>
                </div>

                {/* Error */}
                {error && (
                    <p className="bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm rounded-lg px-4 py-3 mt-6">
                        {error}
                    </p>
                )}

                {/* Stats and search */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3 sm:w-40">
                        <p className="text-xs text-white/60">
                            Projects
                        </p>

                        <p className="text-2xl font-medium mt-1">
                            {projects.length}
                        </p>
                    </div>

                    <div className="relative flex-1">
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
                            onChange={(e) =>
                                setsearch(e.target.value)
                            }
                            placeholder="Search projects..."
                            className="w-full h-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-pink-500"
                        />
                    </div>
                </div>

                {/* Project cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    {filtered.map((p) => (
                        <div
                            key={p._id}
                            onClick={() => handleSelect(p)}
                            className={`cursor-pointer rounded-2xl border p-5 transition-colors ${
                                selectedProject?._id === p._id
                                    ? "border-pink-500 bg-pink-500/10"
                                    : "border-white/10 bg-black/60 hover:border-pink-500/60 hover:bg-pink-500/5"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
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

                                    <p className="font-medium truncate">
                                        {p.name}
                                    </p>
                                </div>

                                {selectedProject?._id === p._id && (
                                    <span className="bg-pink-500/15 text-pink-300 rounded-full px-2.5 py-1 text-[11px] shrink-0">
                                        Selected
                                    </span>
                                )}
                            </div>

                            <p className="text-white/60 text-sm mt-4 line-clamp-2 min-h-[40px]">
                                {p.description || "No description"}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
                                <span className="bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/70">
                                    {p.database || "mongodb"}
                                </span>

                                {p.region && (
                                    <span className="bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/70">
                                        {p.region}
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-center text-xs text-white/50 mt-4 pt-4 border-t border-white/10">
                                <span>
                                    Created {timeAgo(p.createdAt)}
                                </span>

                                <div className="flex items-center gap-3">
                                    {/* Delete button (stopPropagation so the card is not opened) */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setProjectToDelete(p);
                                        }}
                                        className="flex items-center gap-1.5 border border-white/20 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <path d="M10 11v6" />
                                            <path d="M14 11v6" />
                                        </svg>
                                        Delete
                                    </button>

                                    <span className="text-pink-400">
                                        Open →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="text-center bg-black/60 border border-white/10 rounded-2xl py-12 mt-5">
                        <p className="text-white/60 text-sm">
                            {projects.length === 0
                                ? "No projects yet. Create your first project to get started."
                                : "No projects found."}
                        </p>

                        {projects.length === 0 && (
                            <Link
                                href="/createProject"
                                className="inline-block mt-5 text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl font-medium text-sm rounded-lg px-5 py-2.5"
                            >
                                + Create project
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Delete confirmation */}
            {projectToDelete && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center px-4"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                    onClick={() => !deleting && setProjectToDelete(null)}
                >
                    <div
                        className="w-full max-w-sm bg-[#0b0b0f] border border-white/10 rounded-2xl p-6 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                            <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 6h18" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </div>

                        <h2 className="text-xl font-semibold mt-5">
                            Delete project?
                        </h2>

                        <p className="text-white/60 text-sm mt-2">
                            <span className="text-white font-medium">
                                {projectToDelete.name}
                            </span>{" "}
                            and all its collections, data and API keys will be
                            deleted permanently. This cannot be undone.
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setProjectToDelete(null)}
                                disabled={deleting}
                                className="flex-1 border border-white/20 hover:bg-white/10 font-medium text-sm rounded-lg px-5 py-3 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 text-white bg-gradient-to-br from-rose-600 to-red-600 hover:bg-gradient-to-bl font-medium text-sm rounded-lg px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;