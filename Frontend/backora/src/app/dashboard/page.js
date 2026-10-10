import React from 'react'

const bandwidth = [1150, 650, 350, 600, 1050, 1150, 850, 600, 350, 550, 900, 950, 650, 550, 750, 950, 650, 550, 900, 600, 1050, 900, 950, 600, 550, 900, 600, 550, 900, 650, 500, 600, 750, 800, 950]
const realtime = [13, 9, 5, 7, 11, 13, 9, 5, 7, 11, 9, 5]

const Dashboard = () => {
    return (
        <div className='min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_60%_40%_at_30%_35%,rgba(190,40,80,0.18),transparent_70%)] text-white px-4 py-10'>
            <div className='max-w-6xl mx-auto'>

                {/* Title */}
                <h1 className='text-xl font-medium'>Backore Project</h1>
                <button className='mt-3 bg-white/10 border border-white/10 rounded-full px-3 py-1 text-xs text-white/80 hover:bg-white/15'>Project ID</button>

                {/* Row 1: big charts */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6'>

                    {/* Bandwidth */}
                    <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-6'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-2xl font-medium'>1.19 <span className='text-xs text-white/60'>GB</span></p>
                                <p className='text-xs text-white/50 mt-1'>Bandwidth</p>
                            </div>
                            <button className='flex items-center gap-1 text-xs text-white/80'>
                                30d
                                <svg className='w-3 h-3' viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 7.5 5 5 5-5" /></svg>
                            </button>
                        </div>

                        <div className='flex gap-3 mt-6'>
                            <div className='flex flex-col justify-between h-40 text-[10px] text-white/50 text-right'>
                                <span>2000</span><span>1500</span><span>1000</span><span>500</span><span>0</span>
                            </div>
                            <div className='relative flex-1 h-40'>
                                <div className='absolute inset-0 flex flex-col justify-between'>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                </div>
                                <div className='relative flex items-end gap-[3px] h-full'>
                                    {bandwidth.map((v, i) => (
                                        <div key={i} className='relative flex-1 h-full flex items-end'>
                                            <div className='absolute bottom-0 w-full bg-pink-500/30 rounded-t-sm' style={{ height: `${(v + 250) / 20}%` }}></div>
                                            <div className='relative w-full bg-pink-500 rounded-t-sm' style={{ height: `${v / 20}%` }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between text-[10px] text-white/50 mt-2 pl-9'>
                            <span>15 July</span>
                            <span>18 Aug</span>
                        </div>
                    </div>

                    {/* Requests */}
                    <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-6'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-2xl font-medium'>2K</p>
                                <p className='text-xs text-white/50 mt-1'>Requests</p>
                            </div>
                            <button className='flex items-center gap-1 text-xs text-white/80'>
                                30d
                                <svg className='w-3 h-3' viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 7.5 5 5 5-5" /></svg>
                            </button>
                        </div>

                        <div className='flex gap-3 mt-6'>
                            <div className='flex flex-col justify-between h-40 text-[10px] text-white/50 text-right'>
                                <span>4000</span><span>3000</span><span>2000</span><span>1000</span><span>0</span>
                            </div>
                            <div className='relative flex-1 h-40'>
                                <div className='absolute inset-0 flex flex-col justify-between'>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                </div>
                                <svg className='relative w-full h-full' viewBox="0 0 300 120" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
                                            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,118 C15,100 25,48 45,48 S75,72 95,68 S125,48 145,50 S175,20 195,22 S225,62 245,55 S280,48 300,68 L300,120 L0,120 Z" fill="url(#area)" />
                                    <path d="M0,118 C15,100 25,48 45,48 S75,72 95,68 S125,48 145,50 S175,20 195,22 S225,62 245,55 S280,48 300,68" fill="none" stroke="#ec4899" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </div>
                        </div>
                        <div className='flex justify-between text-[10px] text-white/50 mt-2 pl-9'>
                            <span>15 July</span>
                            <span>16 Aug</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: stats + realtime */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5'>

                    <div className='lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5'>

                        {/* Databases */}
                        <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-6'>
                            <div className='flex items-center gap-2 text-[11px] text-white/60'>
                                <svg className='w-3.5 h-3.5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
                                <span>DATABASES</span>
                            </div>
                            <p className='text-2xl font-medium mt-5'>4</p>
                            <div className='flex justify-between text-xs text-white/50 mt-2'>
                                <span>Databases</span>
                                <span>Documents: 20</span>
                            </div>
                        </div>

                        {/* Storage */}
                        <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-6'>
                            <div className='flex items-center gap-2 text-[11px] text-white/60'>
                                <svg className='w-3.5 h-3.5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
                                <span>STORAGE</span>
                            </div>
                            <p className='text-2xl font-medium mt-5'>8.0 <span className='text-xs text-white/60'>MB</span></p>
                            <div className='flex justify-between text-xs text-white/50 mt-2'>
                                <span>Storage</span>
                                <span>Buckets: 44</span>
                            </div>
                        </div>

                        {/* Authentication */}
                        <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-6'>
                            <div className='flex items-center gap-2 text-[11px] text-white/60'>
                                <svg className='w-3.5 h-3.5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                <span>AUTHENTICATION</span>
                            </div>
                            <p className='text-2xl font-medium mt-5'>4K</p>
                            <div className='flex justify-between text-xs text-white/50 mt-2'>
                                <span>Users</span>
                                <span>Sessions: 20K</span>
                            </div>
                        </div>

                        {/* Functions */}
                        <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-6'>
                            <div className='flex items-center gap-2 text-[11px] text-white/60'>
                                <svg className='w-3.5 h-3.5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
                                <span>FUNCTIONS</span>
                            </div>
                            <p className='text-2xl font-medium mt-5'>12</p>
                            <div className='flex justify-between text-xs text-white/50 mt-2'>
                                <span>Executions</span>
                            </div>
                        </div>
                    </div>

                    {/* Realtime */}
                    <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-6'>
                        <p className='text-2xl font-medium'>10</p>
                        <p className='text-xs text-white/50 mt-1'>Realtime Connections</p>

                        <div className='flex gap-3 mt-8'>
                            <div className='flex flex-col justify-between h-40 text-[10px] text-white/50 text-right'>
                                <span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
                            </div>
                            <div className='relative flex-1 h-40'>
                                <div className='absolute inset-0 flex flex-col justify-between'>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                    <div className='border-t border-white/10'></div>
                                </div>
                                <div className='relative flex items-end justify-between gap-2 h-full px-1'>
                                    {realtime.map((v, i) => (
                                        <div key={i} className='flex-1 bg-pink-500 rounded-t-sm' style={{ height: `${v * 5}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className='text-[10px] text-white/50 mt-3 pl-9'>Last 60 seconds</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard