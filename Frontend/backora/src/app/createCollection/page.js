"use client"
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useProject } from "../context/projectContext";

// ready-made collections, users can't create their own fields
const predefined = [
    {
        key: "users",
        title: "users",
        short: "User accounts",
        desc: "You can use signin, signup and signout feature.",
        schema: {
            username: { type: "String", required: true, unique: false },
            email: { type: "String", required: true, unique: true },
            password: { type: "String", required: true, unique: false },
            avatar: { type: "String", required: false, unique: false },
        },
    },
]
const CreateCollection = () => {
    const [name, setname] = useState("")
    const [selected, setselected] = useState(null)
    const { projectId } = useProject();

    const router = useRouter();

    // get this from your selected project
    const projectid = projectId;

    const handleSelect = (item) => {
        setselected(item)
        setname(item.key)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!projectId) {
            toast.error("Please select a project first");
            return;
        }

        if (!selected) {
            toast.error("Please select a predefined collection");
            return
        }

        try {
            const data = { name, schema: selected.schema }

            const res = await axios.post(`${process.env.NEXT_PUBLIC_FETCH_URI}/createCollection/${projectid}`, data,
                {
                    withCredentials: true
                }
            );

            console.log(res.data);

            toast("🦄 Collection created", {
                position: "top-right",
                autoClose: 3000,
                theme: "light",
            });

            router.push("/collection");

        } catch (error) {
            console.error(
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to create collection"
            );
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
            <div className='min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(190,40,80,0.35),transparent_70%)] text-white flex justify-center px-4 py-12'>
                <div className='w-full max-w-2xl'>

                    <h1 className='text-3xl font-semibold'>Create a new collection</h1>
                    <p className='text-white/60 text-sm mt-2'>Define how your project stores and organizes data.</p>

                    <form onSubmit={handleSubmit} className='bg-black/60 border border-white/10 rounded-2xl p-6 mt-6 flex flex-col gap-5'>
                        <h2 className='text-xl font-semibold'>Collection details</h2>

                        {/* Collection name */}
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="name" className='text-sm text-white/70'>Collection name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setname(e.target.value)} placeholder='e.g. users' required className='bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500' />
                        </div>

                        <hr className='border-white/10' />

                        {/* Predefined collections */}
                        <div className='flex items-center justify-between'>
                            <h2 className='text-xl font-semibold'>Predefined collections</h2>
                            <span className='bg-pink-500/15 text-pink-300 rounded-full px-3 py-1 text-xs font-medium'>{predefined.length} available</span>
                        </div>

                        <div className='flex flex-col gap-3'>
                            {predefined.map((item) => (
                                <div key={item.key} onClick={() => handleSelect(item)} className={`group cursor-pointer rounded-xl border px-4 py-4 transition-all duration-300 ${selected?.key === item.key ? "border-pink-500 bg-pink-500/10" : "border-white/10 bg-white/5 hover:border-pink-500/60 hover:bg-pink-500/5"}`}>

                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center'>
                                                <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                            </div>
                                            <div>
                                                <p className='font-medium'>{item.title}</p>
                                                <p className='text-white/50 text-xs mt-0.5'>{item.short}</p>
                                            </div>
                                        </div>

                                        {selected?.key === item.key && (
                                            <svg className='w-5 h-5 text-pink-400' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                        )}
                                    </div>

                                    {/* Expands on hover (or when selected) */}
                                    <div className={`overflow-hidden transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-4 ${selected?.key === item.key ? "max-h-24 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                                        <p className='text-sm text-pink-200 bg-white/5 rounded-lg px-3 py-2'>{item.desc}</p>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {/* Schema preview */}
                        <div>
                            <p className='text-sm text-white/70 mb-2'>Schema preview</p>
                            <pre className='bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-pink-300 font-mono overflow-x-auto'>
                                {selected ? JSON.stringify(selected.schema, null, 2) : "Click a predefined collection to see its schema."}
                            </pre>
                        </div>

                        {/* Info */}
                        <div className='bg-white/5 rounded-xl p-4 flex gap-3 text-xs text-white/60'>
                            <svg className='w-4 h-4 text-pink-400 shrink-0 mt-0.5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                            <p>Predefined collections come with a ready-made schema, so fields can't be added here. Your API will use this collection ID.</p>
                        </div>

                        <hr className='border-white/10' />

                        {/* Buttons */}
                        <div className='flex justify-end gap-3'>
                            <Link href="/collections" className='border border-white/20 hover:bg-white/10 font-medium text-sm rounded-lg px-5 py-2.5'>Cancel</Link>
                            <button type="submit" className='text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium text-sm rounded-lg px-5 py-2.5'>+ Create collection</button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}

export default CreateCollection