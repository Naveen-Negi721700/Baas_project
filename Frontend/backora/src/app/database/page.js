"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const URI = process.env.NEXT_PUBLIC_FETCH_URI

// true when the backend only says "nothing found", so we can show an empty list instead of an error
const isEmptyError = (err, text) => {
    const data = err.response?.data
    const body = typeof data === "string" ? data : data?.message || ""

    // the route does not exist on the backend, so this is a real error
    if (/cannot (get|post)/i.test(body)) return false

    return err.response?.status === 404 || body.includes(text)
}

// how a value is shown inside a document (passwords are never shown)
const formatValue = (key, value) => {
    if (/password/i.test(key)) return "••••••••"
    if (typeof value === "string") return `"${value}"`
    if (value !== null && typeof value === "object") return JSON.stringify(value, (k, v) => (/password/i.test(k) ? "••••••••" : v))
    return String(value)
}

const Database = () => {
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    const [selectedProject, setSelectedProject] = useState(null);
    const [collections, setCollections] = useState([]);
    const [loadingCollections, setLoadingCollections] = useState(false);

    const [selectedCollection, setSelectedCollection] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    const [search, setsearch] = useState("");
    const [error, setError] = useState("");

    // 1. all the projects of the user
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${URI}/getProjects`, { withCredentials: true });
                setProjects(res.data.data || []);
            } catch (err) {
                if (!isEmptyError(err, "No projects found")) {
                    console.error("Error fetching projects:", err.response?.data || err.message);
                    setError(err.response?.data?.message || "Failed to fetch projects.");
                }
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchProjects();
    }, []);

    // 2. click a project: show the predefined collections used in it (click again to close)
    const handleSelectProject = async (project) => {
        if (selectedProject?._id === project._id) {
            setSelectedProject(null)
            return
        }

        setSelectedProject(project)
        setCollections([])
        setSelectedCollection(null)
        setDocuments([])
        setError("")

        try {
            setLoadingCollections(true)
            const res = await axios.get(`${URI}/getCollections/${project._id}`, { withCredentials: true });
            setCollections(res.data.data || [])
        } catch (err) {
            if (!isEmptyError(err, "No collections found")) {
                console.error("Error fetching collections:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Failed to fetch collections.");
            }
        } finally {
            setLoadingCollections(false)
        }
    }

    // 3. click a collection: show all the data saved in it
    const handleSelectCollection = async (collection) => {
        setSelectedCollection(collection)
        setDocuments([])
        setsearch("")
        setError("")

        try {
            setLoadingDocs(true)
            const res = await axios.get(`${URI}/getDocuments/${selectedProject._id}/${collection._id}`, { withCredentials: true });
            setDocuments(res.data.data || [])
        } catch (err) {
            if (!isEmptyError(err, "No documents found")) {
                console.error("Error fetching documents:", err.response?.data || err.message);
                setError(err.response?.data?.message || `Failed to fetch documents (status ${err.response?.status}). Check that the getDocuments route exists on the backend.`);
            }
        } finally {
            setLoadingDocs(false)
        }
    }

    const filtered = documents.filter((d) => JSON.stringify(d).toLowerCase().includes(search.toLowerCase()))

    return (
        <div className='min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_50%_at_60%_0%,rgba(190,40,80,0.30),transparent_70%)] text-white flex flex-col lg:flex-row'>

            {/* Left: projects, and the collections of the opened project */}
            <aside className='relative z-[45] lg:sticky lg:top-0 lg:h-screen lg:self-start lg:w-72 shrink-0 bg-black/70 border-b lg:border-b-0 lg:border-r border-white/10 p-3 text-sm lg:overflow-y-auto'>
                <p className='text-[11px] font-semibold text-white/40 px-3 mt-3 mb-2'>PROJECTS ({projects.length})</p>

                {loadingProjects && <p className='text-white/50 text-xs px-3 py-2'>Loading projects...</p>}

                {!loadingProjects && projects.length === 0 && (
                    <p className='text-white/50 text-xs px-3 py-2'>No projects yet.</p>
                )}

                {projects.map((p) => (
                    <div key={p._id}>
                        <button onClick={() => handleSelectProject(p)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-left ${selectedProject?._id === p._id ? "bg-pink-500/15 text-pink-400" : "hover:bg-white/5"}`}>
                            <svg className={`w-3.5 h-3.5 shrink-0 transition-transform ${selectedProject?._id === p._id ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            <svg className='w-4 h-4 shrink-0' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
                            <span className='truncate'>{p.name}</span>
                        </button>

                        {/* Predefined collections used in this project */}
                        {selectedProject?._id === p._id && (
                            <div className='ml-5 border-l border-white/10 pl-2 mt-1 mb-2'>
                                {loadingCollections && <p className='text-white/50 text-xs px-3 py-2'>Loading...</p>}

                                {!loadingCollections && collections.length === 0 && (
                                    <p className='text-white/50 text-xs px-3 py-2'>No collections yet.</p>
                                )}

                                {collections.map((c) => (
                                    <button key={c._id} onClick={() => handleSelectCollection(c)} className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-sm ${selectedCollection?._id === c._id ? "bg-pink-500/15 text-pink-400" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                                        <svg className='w-4 h-4 shrink-0' viewBox="0 0 24 24" fill="currentColor"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
                                        <span className='truncate'>{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

               
            </aside>

            {/* Right: the data of the selected collection */}
            <main className='flex-1 min-w-0 px-4 sm:px-8 py-8'>
                <div className='max-w-5xl mx-auto'>

                    <h1 className='text-3xl font-semibold'>Database</h1>
                    <p className='text-white/60 text-sm mt-2'>Pick a project, then one of its collections, to see the data saved in it.</p>

                    {/* Where you are */}
                    {selectedProject && (
                        <p className='text-xs text-white/50 mt-4'>
                            {selectedProject.name}
                            {selectedCollection && <> <span className='text-white/30'>/</span> <span className='text-pink-300'>{selectedCollection.name}</span></>}
                        </p>
                    )}

                    {/* Error */}
                    {error && (
                        <p className='bg-pink-500/10 border border-pink-500/30 text-pink-300 text-sm rounded-lg px-4 py-3 mt-6'>{error}</p>
                    )}

                    {/* Nothing selected yet */}
                    {!selectedCollection && (
                        <div className='text-center bg-black/60 border border-white/10 rounded-2xl py-16 mt-6'>
                            <p className='text-white/60 text-sm'>
                                {!selectedProject ? "Select a project on the left to see its collections." : "Select a collection on the left to see its data."}
                            </p>
                        </div>
                    )}

                    {/* Data */}
                    {selectedCollection && (
                        <>
                            <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                                <div className='bg-white/[0.03] border border-white/10 rounded-xl px-5 py-2 sm:w-44 h-15 flex flex-col justify-center'>
                                    <p className='text-xs text-white/60'>Documents</p>
                                    <p className='text-2xl font-medium mt-0.5'>{documents.length}</p>
                                </div>

                                <div className='relative flex-1'>
                                    <svg className='w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setsearch(e.target.value)}
                                        placeholder='Filter documents...'
                                        className='w-full h-15 bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-pink-500'
                                    />
                                </div>

                                <button
                                    onClick={() => handleSelectCollection(selectedCollection)}
                                    className='h-15 border border-pink-500/60 hover:bg-pink-500/10 font-medium text-sm rounded-xl px-5'
                                >
                                    Refresh
                                </button>
                            </div>

                            {loadingDocs && <p className='text-white/50 text-sm mt-6'>Loading documents...</p>}

                            {!loadingDocs && filtered.length === 0 && (
                                <div className='text-center bg-black/60 border border-white/10 rounded-2xl py-12 mt-5'>
                                    <p className='text-white/60 text-sm'>{documents.length === 0 ? "No data saved in this collection yet." : "No documents match your filter."}</p>
                                </div>
                            )}

                            {filtered.map((doc, i) => (
                                <div key={doc._id || i} className='bg-black/60 border border-white/10 rounded-2xl p-5 mt-4 font-mono text-xs leading-6 overflow-x-auto'>
                                    {Object.entries(doc).map(([key, value]) => (
                                        value !== null && typeof value === "object" && !Array.isArray(value) ? (
                                            <div key={key}>
                                                <span className='text-white/60'>{key}:</span> <span className='text-white/40'>Object ({Object.keys(value).length})</span>
                                                <div className='ml-5 border-l border-white/10 pl-3'>
                                                    {Object.entries(value).map(([k, v]) => (
                                                        <div key={k} className='flex gap-2'>
                                                            <span className='text-white/60 shrink-0'>{k}:</span>
                                                            <span className='text-pink-300 break-all'>{formatValue(k, v)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={key} className='flex gap-2'>
                                                <span className='text-white/60 shrink-0'>{key}:</span>
                                                <span className='text-pink-300 break-all'>{formatValue(key, value)}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ))}
                        </>
                    )}

                </div>
            </main>
        </div>
    )
}

export default Database