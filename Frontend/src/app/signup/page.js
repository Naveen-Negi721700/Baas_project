"use client"
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from 'react-toastify';

import api from "../lib/api.js";

const Signup = () => {
    const [form, setform] = useState({ username: "", email: "", password: "" })
    const [avatar, setavatar] = useState(null)
    const [preview, setpreview] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handleAvatar = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setavatar(file)
        setpreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        // the backend requires an avatar
        if (!avatar) {
            toast.error("Please choose an avatar");
            return;
        }

        setLoading(true);

        try {
            // avatar is a file, so we send FormData instead of plain JSON
            const data = new FormData()
            data.append("username", form.username)
            data.append("email", form.email)
            data.append("password", form.password)
            data.append("avatar", avatar)

            const res = await api.post("/register", data);

            console.log(res.data);

            toast("🦄 Signup Successfully", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
            });

            setform({ username: "", email: "", password: "" });
            setavatar(null)
            setpreview("")

            router.push("/signin");

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className='min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(190,40,80,0.35),transparent_70%)] text-white flex items-center justify-center px-4'>
                <div className='w-full max-w-sm bg-black/60 border border-white/10 rounded-2xl p-8'>

                    <Link className='flex items-center justify-center gap-2 text-xl font-semibold' href={"/"}>
                        <svg className='w-6 h-6 text-pink-500' viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h6.2a5.3 5.3 0 0 1 3.1 9.6A5.6 5.6 0 0 1 13.4 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
                        </svg>
                        <span>backore</span>
                    </Link>

                    <h1 className='text-2xl font-semibold text-center mt-6'>Create your account</h1>
                    <p className='text-white/60 text-sm text-center mt-2'>Start building your backend for free.</p>

                    <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-6'>

                        {/* Avatar */}
                        <div className='flex flex-col items-center gap-2'>
                            <label htmlFor="avatar" className='cursor-pointer flex flex-col items-center gap-2'>
                                <div className='w-20 h-20 rounded-full bg-white/5 border border-dashed border-white/20 hover:border-pink-500 flex items-center justify-center overflow-hidden'>
                                    {preview ? (
                                        <img src={preview} alt="avatar preview" className='w-full h-full object-cover' />
                                    ) : (
                                        <svg className='w-8 h-8 text-white/40' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    )}
                                </div>
                                <span className='text-xs text-pink-400 hover:underline'>{preview ? "Change avatar" : "Choose avatar (required)"}</span>
                            </label>
                            <input id="avatar" name="avatar" type="file" accept="image/*" onChange={handleAvatar} className='hidden' />
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <label htmlFor="username" className='text-xs text-white/70'>Username</label>
                            <input id="username" name="username" type="text" value={form.username} onChange={handleChange} placeholder='walter123' required className='bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500' />
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <label htmlFor="email" className='text-xs text-white/70'>Email</label>
                            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder='you@example.com' required className='bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500' />
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <label htmlFor="password" className='text-xs text-white/70'>Password</label>
                            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder='At least 8 characters' minLength={8} required className='bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500' />
                        </div>

                        <button type="submit" disabled={loading} className='text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium rounded-lg text-sm px-5 py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed'>{loading ? "Creating account..." : "Create account"}</button>
                    </form>

                    <p className='text-white/60 text-xs text-center mt-6'>
                        Already have an account? <Link href="/signin" className='text-pink-400 hover:underline'>Sign in</Link>
                    </p>

                </div>
            </div>
        </>
    )
}

export default Signup