"use client"
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'

const collections = [
    {
        name: "users", desc: "User accounts", docs: 128, fields: 7, updated: "2 min ago",
        icon: <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    },
    {
        name: "products", desc: "Product catalog", docs: 64, fields: 6, updated: "1 hour ago",
        icon: <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12" /><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" /><path d="m7.5 4.27 9 5.15" /></svg>
    },
    {
        name: "orders", desc: "Customer orders", docs: 312, fields: 6, updated: "Yesterday",
        icon: <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
    },
]

const Collections = () => {
    const [search, setsearch] = useState("")

    const filtered = collections.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    const totalDocs = collections.reduce((sum, c) => sum + c.docs, 0)
    const totalFields = collections.reduce((sum, c) => sum + c.fields, 0)

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

                {/* Stats */}
                <div className='grid grid-cols-3 gap-3 mt-6'>
                    <div className='bg-white/[0.03] border border-white/10 rounded-xl p-4'>
                        <p className='text-xs text-white/60'>Collections</p>
                        <p className='text-2xl font-medium mt-2'>{collections.length}</p>
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
                        <Link key={c.name} href={`/collections/${c.name}`} className='grid grid-cols-[1fr_60px_90px] gap-3 items-center py-5 border-b border-white/10 hover:bg-white/5 rounded-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0'>{c.icon}</div>
                                <div>
                                    <p className='font-medium'>{c.name}</p>
                                    <p className='text-white/50 text-xs mt-0.5'>{c.desc}</p>
                                </div>
                            </div>
                            <span className='text-sm'>{c.docs}</span>
                            <span className='text-sm text-white/70'>{c.updated}</span>
                        </Link>
                    ))}

                    {filtered.length === 0 && (
                        <p className='text-center text-white/50 text-sm py-8'>No collections found.</p>
                    )}

                    <p className='text-white/50 text-xs mt-4'>Select a collection to view its documents and fields.</p>
                </div>

            </div>
        </div>
    )
}

export default Collections