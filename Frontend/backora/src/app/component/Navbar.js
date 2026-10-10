"use client"
import React from 'react'
import Link from 'next/link'

const Navbar = () => {
    return (
        <div className='sticky top-0 z-50 bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_90%_at_100%_0%,rgba(190,40,80,0.35),transparent_65%)] p-3'>
            <div className='bg-black/60 text-white flex justify-between items-center h-20 px-5 rounded-2xl border border-white/10'>

                {/* Left */}
                <div className='flex items-center gap-2 text-sm'>
                    <Link className='flex items-center gap-2 text-lg font-semibold' href={"/"}>
                        <svg className='w-15 h-15 text-pink-500' viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h6.2a5.3 5.3 0 0 1 3.1 9.6A5.6 5.6 0 0 1 13.4 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
                        </svg>
                        <span className='text-4xl'>Backora</span>
                    </Link>
                    <span className='text-white/30'>/</span>
                    <span className='text-white/60'>Acme Corp</span>
                    <span className='text-white/30'>/</span>
                    <span>First Backore project</span>
                </div>

                {/* Right */}
                <div className='flex items-center gap-5 text-xs'>


                    <Link className='flex items-center gap-2 text-lg font-semibold' href={"/signup"}>

                        <button className='border border-white/20 rounded-md px-2.5 py-1 text-lg hover:bg-white/10'>SignUp</button>
                    </Link>

                    <Link className='flex items-center gap-2 text-lg font-semibold' href={"/signin"}>
                    <button className='border border-white/20 rounded-md px-2.5 py-1 text-lg hover:bg-white/10'>SignIn</button>
                    </Link>

                    <div className='flex items-center gap-2.5'>
                        {/* <div className='leading-tight'>
                            <p className='font-medium'>SignUp</p>
                            <p className='text-white/50'>SignIn</p>
                        </div> */}
                        <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center'>WO</div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Navbar