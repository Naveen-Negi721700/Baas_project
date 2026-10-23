import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <div className='bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_90%_at_0%_100%,rgba(190,40,80,0.25),transparent_65%)] p-3'>
            <div className='bg-black/60 text-white rounded-2xl border border-white/10 px-5 py-8 text-sm'>

                {/* Top */}
                <div className='flex flex-col lg:flex-row justify-between gap-10'>

                    {/* Brand + newsletter */}
                    <div className='max-w-xs'>
                        <Link className='flex items-center gap-2 text-lg font-semibold' href={"/"}>
                            <svg className='w-5 h-5 text-pink-500' viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h6.2a5.3 5.3 0 0 1 3.1 9.6A5.6 5.6 0 0 1 13.4 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
                            </svg>
                            <span>backore</span>
                        </Link>
                        <p className='text-white/60 text-xs mt-3'>Build, ship and scale your backend without the busywork.</p>

                        <div className='flex gap-2 mt-5'>
                            <input type="email" placeholder='Enter your email' className='w-full bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-xs placeholder:text-white/40 focus:outline-none focus:border-pink-500' />
                            <button className='border border-white/20 rounded-md px-3 py-1.5 text-xs hover:bg-white/10'>Subscribe</button>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs'>
                        <div className='flex flex-col gap-2'>
                            <p className='font-medium text-sm mb-1'>Product</p>
                            <Link href="#" className='text-white/60 hover:text-white'>Features</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>Pricing</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>Changelog</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>Status</Link>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-medium text-sm mb-1'>Resources</p>
                            <Link href="#" className='text-white/60 hover:text-white'>Docs</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>Guides</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>API reference</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>Support</Link>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-medium text-sm mb-1'>Company</p>
                            <Link href="#" className='text-white/60 hover:text-white'>About</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>Blog</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>Careers</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>Contact</Link>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-medium text-sm mb-1'>Community</p>
                            <Link href="#" className='text-white/60 hover:text-white'>GitHub</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>Discord</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>X (Twitter)</Link>
                            <Link href="#" className='text-white/60 hover:text-white'>LinkedIn</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className='flex flex-col md:flex-row justify-between items-center gap-3 mt-8 pt-5 border-t border-white/10 text-xs text-white/60'>
                    <p>© Backore. All rights reserved.</p>
                    <div className='flex gap-5'>
                        <Link href="#" className='hover:text-white'>Privacy</Link>
                        <Link href="#" className='hover:text-white'>Terms</Link>
                        <Link href="#" className='hover:text-white'>Cookies</Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Footer