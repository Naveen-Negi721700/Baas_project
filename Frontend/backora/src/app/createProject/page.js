"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useProject } from "../context/projectContext";

const CreateProject = () => {
    const [form, setform] = useState({ title: "", description: "", });
    const [region, setRegion] = useState("Asia Pacific (Mumbai)");
    const { setSelectedProject } = useProject();
    const router = useRouter();

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_FETCH_URI}/createProject`,
                form,
                {
                    withCredentials: true,
                }
            );

            console.log(res.data);
            // Adjust this according to your actual backend response.
            const project = res.data.data ?? res.data;

            if (!project?._id) {
                throw new Error("Project ID was not returned by the backend");
            }

            // Save the newly created project in Context.
            setSelectedProject(project);
            setform({
                title: "",
                description: "",
            });

            toast.success("Project created successfully!");
            router.push("/collection");

        } catch (error) {
            console.error(error.response?.data || error.message);

            toast.error(
                error.response?.data?.message ||
                "Failed to create project"
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b0f] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(190,40,80,0.35),transparent_70%)] text-white flex justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <h1 className="text-3xl font-semibold">
                    Create a new project
                </h1>

                <p className="text-white/60 text-sm mt-2">
                    Set up a backend for your next application.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="bg-black/60 border border-white/10 rounded-2xl p-6 mt-6 flex flex-col gap-5"
                >
                    <h2 className="text-xl font-semibold">
                        Project details
                    </h2>

                    {/* Project title */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="title"
                            className="text-sm text-white/70"
                        >
                            Project title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. My awesome app"
                            required
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="description"
                            className="text-sm text-white/70"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="What is this project about?"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-pink-500 resize-none"
                        />
                    </div>

                    {/* Region - frontend only */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="region"
                            className="text-sm text-white/70"
                        >
                            Region
                        </label>

                        <div className="relative">
                            <select
                                id="region"
                                name="region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500"
                            >
                                <option className="bg-[#0b0b0f]">
                                    Asia Pacific (Mumbai)
                                </option>
                                <option className="bg-[#0b0b0f]">
                                    Asia Pacific (Singapore)
                                </option>
                                <option className="bg-[#0b0b0f]">
                                    US East (N. Virginia)
                                </option>
                                <option className="bg-[#0b0b0f]">
                                    Europe (Frankfurt)
                                </option>
                            </select>

                            <svg
                                className="w-4 h-4 text-white/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m5 7.5 5 5 5-5" />
                            </svg>
                        </div>
                    </div>

                    {/* Database */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-white/70">
                            Database
                        </p>

                        <div className="flex items-center justify-between bg-pink-500/10 border border-pink-500 rounded-xl px-4 py-4">
                            <div className="flex items-center gap-3">
                                <svg
                                    className="w-5 h-5 text-pink-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                                    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                                    <path d="M3 12A9 3 0 0 0 21 12" />
                                </svg>

                                <div>
                                    <p className="font-medium">MongoDB</p>
                                    <p className="text-white/50 text-xs mt-0.5">
                                        Flexible document database
                                    </p>
                                </div>
                            </div>

                            <svg
                                className="w-5 h-5 text-pink-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>
                    </div>

                    <hr className="border-white/10" />

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href="/dashboard"
                            className="border border-white/20 hover:bg-white/10 font-medium text-sm rounded-lg px-5 py-2.5"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-500/30 font-medium text-sm rounded-lg px-5 py-2.5"
                        >
                            Create project →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );


};

export default CreateProject
