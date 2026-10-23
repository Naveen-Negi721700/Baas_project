"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";

import api from "../lib/api.js";
import { useAuth } from "@/app/context/authContext";

const Signout = () => {
    const router = useRouter();
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSignout = async () => {
        if (loading) return;

        setLoading(true);

        try {
            await api.post("/logOut", {});

            toast.success("Signed out successfully", {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            console.error(
                "Logout failed:",
                error.response?.data || error.message
            );
        } finally {
            // Clear the user from frontend authentication state
            setUser(null);

            setLoading(false);

            // Redirect to signin even if the logout request fails
            router.replace("/signin");
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            <div className="min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(190,40,80,0.35),transparent_70%)] text-white flex items-center justify-center px-4">
                <div className="w-full max-w-sm bg-black/60 border border-white/10 rounded-2xl p-8 text-center">

                    {/* Logo */}
                    <Link
                        className="flex items-center justify-center gap-2 text-xl font-semibold"
                        href="/"
                    >
                        <svg
                            className="w-6 h-6 text-pink-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h6.2a5.3 5.3 0 0 1 3.1 9.6A5.6 5.6 0 0 1 13.4 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
                        </svg>

                        <span>backore</span>
                    </Link>

                    {/* Signout icon */}
                    <div className="w-14 h-14 rounded-full bg-pink-500/15 border border-pink-500/30 flex items-center justify-center mx-auto mt-6">
                        <svg
                            className="w-6 h-6 text-pink-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <path d="m16 17 5-5-5-5" />
                            <path d="M21 12H9" />
                        </svg>
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl font-semibold mt-5">
                        Sign out?
                    </h1>

                    <p className="text-white/60 text-sm mt-2">
                        You will need to sign in again to access your projects.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-7">
                        <Link
                            href="/"
                            className="flex-1 border border-white/20 hover:bg-white/10 font-medium text-sm rounded-lg px-5 py-3"
                        >
                            Cancel
                        </Link>

                        <button
                            type="button"
                            onClick={handleSignout}
                            disabled={loading}
                            className="flex-1 text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium text-sm rounded-lg px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing out..." : "Sign out"}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Signout;