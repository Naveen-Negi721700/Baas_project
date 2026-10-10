import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
        <div className='bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(190,40,80,0.35),transparent_70%)] text-white px-4 py-16'>
            <div className='max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12'>

                {/* Left */}
                <div className='flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2'>
                    <span className='bg-pink-500/15 text-pink-300 border border-pink-500/30 rounded-full px-3 py-1 text-xs font-medium'>The backend for your next big idea</span>

                    <h1 className='text-4xl sm:text-5xl font-semibold mt-5'>Build your app.</h1>
                    <h1 className='text-4xl sm:text-5xl font-semibold text-pink-500 mt-1'>We'll handle the backend.</h1>

                    <p className='text-white/60 mt-5 max-w-md'>Authentication, database, and APIs in one place. Ship your ideas faster.</p>

                    <div className='flex flex-wrap justify-center gap-3 mt-7'>
                        <Link href="/login" className='bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl font-medium text-sm rounded-lg px-5 py-3'>Start building free →</Link>
                        <Link href="#" className='border border-white/20 hover:bg-white/10 font-medium text-sm rounded-lg px-5 py-3'>Explore docs</Link>
                    </div>
                </div>

                {/* Right */}
                <div className='w-full max-w-md lg:w-1/2'>

                    {/* Backend card */}
                    <div className='bg-black/60 border border-white/10 rounded-2xl p-4'>
                        <div className='flex justify-between items-start'>
                            <div className='flex gap-3'>
                                <svg className='w-5 h-5 text-pink-400 mt-1' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" />
                                </svg>
                                <div>
                                    <p className='font-medium'>Your backend, ready to go</p>
                                    <p className='text-white/50 text-xs mt-1'>Database · Authentication · APIs</p>
                                </div>
                            </div>
                            <span className='bg-pink-500/15 text-pink-300 rounded-full px-3 py-1 text-xs'>Connected</span>
                        </div>

                        <div className='bg-white/5 rounded-xl p-4 mt-4 font-mono text-sm leading-7'>
                            <p className='text-pink-300'>GET /api/v1/products</p>
                            <p>{'{'}</p>
                            <p>"success": true,</p>
                            <p>"data": ["products"]</p>
                            <p>{'}'}</p>
                        </div>

                        <div className='grid grid-cols-2 gap-3 mt-3'>
                            <div className='bg-white/5 rounded-xl p-4'>
                                <svg className='w-5 h-5 text-pink-400' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" />
                                </svg>
                                <p className='font-medium mt-3'>Authentication</p>
                                <p className='text-white/50 text-xs mt-1'>Secure user login</p>
                            </div>
                            <div className='bg-white/5 rounded-xl p-4'>
                                <svg className='w-5 h-5 text-pink-400' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" />
                                </svg>
                                <p className='font-medium mt-3'>Database</p>
                                <p className='text-white/50 text-xs mt-1'>Organize your data</p>
                            </div>
                        </div>
                    </div>

                    {/* Small cards */}
                    <div className='grid grid-cols-2 gap-3 mt-3'>
                        <div className='bg-black/60 border border-white/10 rounded-2xl p-4'>
                            <svg className='w-5 h-5 text-pink-400' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" />
                            </svg>
                            <p className='font-medium mt-3'>Database</p>
                            <p className='text-white/60 text-sm mt-2'>Create collections and manage documents.</p>
                        </div>
                        <div className='bg-black/60 border border-white/10 rounded-2xl p-4'>
                            <svg className='w-5 h-5 text-pink-400' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                            </svg>
                            <p className='font-medium mt-3'>API keys</p>
                            <p className='text-white/60 text-sm mt-2'>Connect your applications securely.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
