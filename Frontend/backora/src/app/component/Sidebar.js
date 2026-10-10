"use client"
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'

const Sidebar = () => {
    const [open, setopen] = useState(false)

    return (
        <>
            {/* Invisible hover area on the left edge (change w-4 to increase/decrease the distance) */}
            <div className='fixed left-0 top-0 h-full w-4 z-40' onMouseEnter={() => setopen(true)}></div>

            {/* Sidebar */}
            <div onMouseLeave={() => setopen(false)} className={`fixed left-0 top-0 h-full w-64 z-50 bg-[#0b0b0f] bg-[radial-gradient(ellipse_100%_40%_at_0%_100%,rgba(190,40,80,0.25),transparent_70%)] border-r border-white/10 text-white p-3 text-sm transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>

                <p className='text-[11px] font-semibold text-white/40 px-3 mt-3 mb-2'>BUILD</p>
                <Link href="/" className='flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4 text-white/60' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
                    <span>Quickstart</span>
                </Link>


                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5"
                >
                    <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v6" /><path d="M9 13h6" /><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
                    {/* Keep your existing SVG icon */}
                    <span>Dashboard</span>
                </Link>


                <Link href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4 text-white/60' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" /></svg>
                    <span>My Collections</span>
                </Link>
                {/* Active item */}

                <Link href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v6" /><path d="M9 13h6" /><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
                    <span>Create Collection</span>
                </Link>



                <Link href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4 text-white/60' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                    <span>Databases</span>
                </Link>
                


                



                {/* <Link href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v6" /><path d="M9 13h6" /><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
                    <span>Create Collection</span>
                </Link> */}


                <p className='text-[11px] font-semibold text-white/40 px-3 mt-5 mb-2'>MANAGE</p>
                <Link href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4 text-white/60' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    <span>Pricing</span>
                </Link>
                <Link href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4 text-white/60' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                    <span>Settings</span>
                </Link>

                <p className='text-[11px] font-semibold text-white/40 px-3 mt-5 mb-2'>TOOLS / RESOURCES</p>
                <Link href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4 text-white/60' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                    <span>NUC Viewer</span>
                </Link>
                <Link href="#" className='flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4 text-white/60' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
                    <span className='flex-1'>Docs</span>
                    <svg className='w-4 h-4 text-white/60' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                </Link>

                <p className='text-[11px] font-semibold text-white/40 px-3 mt-5 mb-2'>THEME</p>
                <button className='w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-white/5'>
                    <svg className='w-4 h-4 text-white/60' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                    <span>Dark mode</span>
                </button>

            </div>
        </>
    )
}

export default Sidebar