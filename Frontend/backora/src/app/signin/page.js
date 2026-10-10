"use client"
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'

const Signin = () => {
    const [form, setform] = useState({ email: "", password: "" })

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // sign the user in here (your API or next-auth signIn)
        console.log(form)
    }

    return (
        <div className='min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(190,40,80,0.35),transparent_70%)] text-white flex items-center justify-center px-4'>
            <div className='w-full max-w-sm bg-black/60 border border-white/10 rounded-2xl p-8'>

                <Link className='flex items-center justify-center gap-2 text-xl font-semibold' href={"/"}>
                    <svg className='w-6 h-6 text-pink-500' viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h6.2a5.3 5.3 0 0 1 3.1 9.6A5.6 5.6 0 0 1 13.4 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
                    </svg>
                    <span>backore</span>
                </Link>

                <h1 className='text-2xl font-semibold text-center mt-6'>Welcome back</h1>
                <p className='text-white/60 text-sm text-center mt-2'>Sign in to your Backore account.</p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-6'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="email" className='text-xs text-white/70'>Email</label>
                        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder='you@example.com' required className='bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500' />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <div className='flex justify-between items-center'>
                            <label htmlFor="password" className='text-xs text-white/70'>Password</label>
                            <Link href="#" className='text-xs text-pink-400 hover:underline'>Forgot password?</Link>
                        </div>
                        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder='Enter your password' required className='bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500' />
                    </div>

                    <button type="submit" className='text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium rounded-lg text-sm px-5 py-3 mt-2'>Sign in</button>
                </form>

                <p className='text-white/60 text-xs text-center mt-6'>
                    Don't have an account? <Link href="/signup" className='text-pink-400 hover:underline'>Sign up</Link>
                </p>

            </div>
        </div>
    )
}

export default Signin