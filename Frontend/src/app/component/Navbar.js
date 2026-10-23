"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/authContext";

const Navbar = () => {
    const { user, loading } = useAuth();

    return (
        <div className="sticky top-0 z-50 bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_90%_at_100%_0%,rgba(190,40,80,0.35),transparent_65%)] p-3">
            <div className="bg-black/60 text-white flex justify-between items-center min-h-20 px-5 rounded-2xl border border-white/10">

                <div className="flex items-center gap-2 text-sm min-w-0">
                    <Link
                        className="flex items-center gap-2 text-lg font-semibold shrink-0"
                        href="/"
                    >
                        <svg
                            className="w-15 h-15 text-pink-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h6.2a5.3 5.3 0 0 1 3.1 9.6A5.6 5.6 0 0 1 13.4 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
                        </svg>

                        <span className="text-4xl">Backora</span>
                    </Link>

                    <span className="text-white/30">/</span>
                    <span className="text-white/60 hidden sm:inline">
                        Acme Corp
                    </span>
                    <span className="text-white/30 hidden sm:inline">/</span>
                    <span className="hidden md:inline">
                        First Backora project
                    </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    {loading ? (
                        <div
                            className="w-10 h-10 rounded-full bg-white/10 animate-pulse"
                            aria-label="Checking login status"
                        />
                    ) : user ? (
                        <>
                            <Link
                                href="/signout"
                                className="border border-white/20 rounded-md px-2.5 py-1 text-lg font-semibold hover:bg-white/10"
                            >
                                SignOut
                            </Link>

                            <div
                                className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"
                                title={user.username || "User"}
                            >
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt="User avatar"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <span className="text-base font-medium">
                                        {user.username?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/signup"
                                className="border border-white/20 rounded-md px-2.5 py-1 text-lg font-semibold hover:bg-white/10"
                            >
                                SignUp
                            </Link>

                            <Link
                                href="/signin"
                                className="border border-white/20 rounded-md px-2.5 py-1 text-lg font-semibold hover:bg-white/10"
                            >
                                SignIn
                            </Link>

                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                WO
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;