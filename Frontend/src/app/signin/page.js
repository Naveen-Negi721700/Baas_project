"use client";

import React, { useState } from "react";
import Link from "next/link";
import api from "@/app/lib/api.js";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/authContext";

const Signin = () => {
    const [form, setform] = useState({
        usernameOrEmail: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { getCurrentUser } = useAuth();

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            // Login using the shared API instance
            const res = await api.post("/logIn", form);

            console.log(res.data);

            // Fetch the logged-in user's information
            // api.js handles eligible 401 refresh attempts automatically.
            const user = await getCurrentUser();

            if (!user) {
                toast.error(
                    "Login succeeded, but could not fetch user information."
                );
                return;
            }

            // Reset form
            setform({
                usernameOrEmail: "",
                password: "",
            });

            toast.success("Sign in successful!");

            router.push("/");
        } catch (error) {
            console.error(
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to sign in"
            );
        } finally {
            setLoading(false);
        }
    };

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

            <div className="min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(190,40,80,0.35),transparent_70%)] text-white flex items-center justify-center px-4">
                <div className="w-full max-w-sm bg-black/60 border border-white/10 rounded-2xl p-8">

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

                    <h1 className="text-2xl font-semibold text-center mt-6">
                        Welcome back
                    </h1>

                    <p className="text-white/60 text-sm text-center mt-2">
                        Sign in to your Backore account.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 mt-6"
                    >
                        {/* Username or Email */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="usernameOrEmail"
                                className="text-xs text-white/70"
                            >
                                Username or Email
                            </label>

                            <input
                                id="usernameOrEmail"
                                name="usernameOrEmail"
                                type="text"
                                value={form.usernameOrEmail}
                                onChange={handleChange}
                                placeholder="Enter your username or email"
                                autoComplete="username"
                                required
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="text-xs text-white/70"
                                >
                                    Password
                                </label>

                                <Link
                                    href="#"
                                    className="text-xs text-pink-400 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium rounded-lg text-sm px-5 py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="text-white/60 text-xs text-center mt-6">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-pink-400 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signin;
