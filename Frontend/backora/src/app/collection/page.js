"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useProject } from "../context/projectContext";

// turns a date into "2 min ago", "1 hour ago", "Yesterday"
const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour ago`
    if (seconds < 172800) return "Yesterday"
    return `${Math.floor(seconds / 86400)} days ago`
}

const Collections = () => {
    const { projectId, isReady } = useProject();

    const [search, setsearch] = useState("");
    const [collection, setCollection] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isReady) return;

        if (!projectId) {
            setCollection([]);
            setLoading(false);
            return;
        }

        const fetchCollections = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_FETCH_URI}/getCollections/${projectId}`,
                    {
                        withCredentials: true,
                    }
                );

                setCollection(res.data.data || []);
            } catch (err) {
                const data = err.response?.data

                // backend says "No collections found" when the project is new, so just show an empty list
                const isEmpty =
                    err.response?.status === 404 ||
                    (typeof data === "string" && data.includes("No collections found")) ||
                    data?.message?.includes("No collections found")

                if (isEmpty) {
                    setCollection([]);
                } else {
                    console.error(
                        "Error fetching collections:",
                        data || err.message
                    );

                    setError(
                        data?.message ||
                        "Failed to fetch collections."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, [projectId, isReady]);

    // everything below uses the data from backend
    const filtered = collection.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    const totalDocs = collection.reduce((sum, c) => sum + (c.docs ?? 0), 0)
    const totalFields = collection.reduce((sum, c) => sum + Object.keys(c.schema || {}).length, 0)

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
        <div className='min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(190,40,80,0.30),transparent_70%)] text-white px-4 py-10'>
            <div className='max-w-3xl mx-auto'>

                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
                    <div>
                        <h1 className='text-3xl font-semibold'>Collections</h1>
                        <p className='text-white/60 text-sm mt-2 max-w-xs'>Organize and manage your project data.</p>
                    </div>
                    <Link href="/createCollection" className='text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium text-sm rounded-lg px-5 py-2.5'>+ New collection</Link>
                </div>

                {/* Error */}
                {error && (
                    <p className='bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm rounded-lg px-4 py-3 mt-6'>{error}</p>
                )}

                {/* Stats */}
                <div className='grid grid-cols-3 gap-3 mt-6'>
                    <div className='bg-white/[0.03] border border-white/10 rounded-xl p-4'>
                        <p className='text-xs text-white/60'>Collections</p>
                        <p className='text-2xl font-medium mt-2'>{collection.length}</p>
                    </div>
                    <div className='bg-white/[0.03] border border-white/10 rounded-xl p-4'>
                        <p className='text-xs text-white/60'>Documents</p>
                        <p className='text-2xl font-medium mt-2'>{totalDocs}</p>
                    </div>
                    <div className='bg-white/[0.03] border border-white/10 rounded-xl p-4'>
                        <p className='text-xs text-white/60'>Fields</p>
                        <p className='text-2xl font-medium mt-2'>{totalFields}</p>
                    </div>
                </div>

                {/* List card */}
                <div className='bg-black/60 border border-white/10 rounded-2xl p-5 mt-5'>

                    {/* Search */}
                    <div className='relative'>
                        <svg className='w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        <input type="text" value={search} onChange={(e) => setsearch(e.target.value)} placeholder='Search collections...' className='w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-pink-500' />
                    </div>

                    {/* Table head */}
                    <div className='grid grid-cols-[1fr_60px_90px] gap-3 text-[11px] text-white/50 mt-5 pb-3 border-b border-white/10'>
                        <span>COLLECTION</span>
                        <span>DOCS</span>
                        <span>UPDATED</span>
                    </div>

                    {/* Rows */}
                    {filtered.map((c) => (
                        <Link key={c._id} href={`/collections/${c.name}`} className='grid grid-cols-[1fr_60px_90px] gap-3 items-center py-5 border-b border-white/10 hover:bg-white/5 rounded-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0'>
                                    <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
                                </div>
                                <div>
                                    <p className='font-medium'>{c.name}</p>
                                    <p className='text-white/50 text-xs mt-0.5'>{c.isSystem ? "System collection" : "Custom collection"} · {Object.keys(c.schema || {}).length} fields</p>
                                </div>
                            </div>
                            <span className='text-sm'>{c.docs ?? 0}</span>
                            <span className='text-sm text-white/70'>{timeAgo(c.updatedAt)}</span>
                        </Link>
                    ))}

                    {filtered.length === 0 && (
                        <p className='text-center text-white/50 text-sm py-8'>
                            {collection.length === 0 ? "No collections yet. Click + New collection to add one." : "No collections found."}
                        </p>
                    )}

                    <p className='text-white/50 text-xs mt-4'>Select a collection to view its documents and fields.</p>
                </div>

            </div>
        </div>
    )
}

export default Collections