"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

import api from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { useProject } from "@/app/context/projectContext";

const GREETING = {
    role: "assistant",
    text: "Hi! I'm the Backora assistant. Ask me anything about projects, collections or API keys.",
};

// quick questions shown before the first message
const SUGGESTIONS = [
    "Create a project called todo-list with an API key",
    "How do I generate an API key?",
    "What are collections?",
];

// the Backora logo mark
const Logo = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h6.2a5.3 5.3 0 0 1 3.1 9.6A5.6 5.6 0 0 1 13.4 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
    </svg>
);

// a code block with a Copy button
const CodeBlock = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="my-2 rounded-xl overflow-hidden border border-white/10 bg-black/40">
            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 text-[11px] text-white/60">
                <span>{language || "code"}</span>
                <button type="button" onClick={handleCopy} className="hover:text-pink-400">
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <pre className="chat-scroll p-3 overflow-x-auto text-xs leading-5 font-mono text-pink-300">{code}</pre>
        </div>
    );
};

// **bold**, `code` and [links](/page) inside a line
const renderInline = (text) =>
    text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(\/[^)\s]*\))/g).map((part, i) => {
        // only links inside the app are allowed (they start with /)
        const link = part.match(/^\[([^\]]+)\]\((\/[^)\s]*)\)$/);

        if (link) {
            return (
                <Link key={i} href={link[2]} className="text-pink-400 underline underline-offset-2 hover:text-pink-300">
                    {link[1]}
                </Link>
            );
        }

        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
            return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
            return <code key={i} className="px-1 py-0.5 rounded bg-white/10 font-mono text-[12px] text-pink-300">{part.slice(1, -1)}</code>;
        }
        return part;
    });

// paragraphs, bullet lists, numbered lists and headings
const renderLines = (text) =>
    text.trim().split("\n").map((line, i) => {
        const bullet = line.match(/^\s*[-*]\s+(.*)/);
        const numbered = line.match(/^\s*(\d+)\.\s+(.*)/);
        const heading = line.match(/^#{1,3}\s+(.*)/);

        if (!line.trim()) return <div key={i} className="h-2" />;

        if (bullet) {
            return (
                <div key={i} className="flex gap-2 pl-1">
                    <span className="text-pink-400">•</span>
                    <span className="min-w-0">{renderInline(bullet[1])}</span>
                </div>
            );
        }

        if (numbered) {
            return (
                <div key={i} className="flex gap-2 pl-1">
                    <span className="text-pink-400 shrink-0">{numbered[1]}.</span>
                    <span className="min-w-0">{renderInline(numbered[2])}</span>
                </div>
            );
        }

        if (heading) return <p key={i} className="font-semibold mt-1">{renderInline(heading[1])}</p>;

        return <p key={i}>{renderInline(line)}</p>;
    });

// splits an answer into normal text and ```code``` blocks
const renderMessage = (text) => {
    const parts = text.split(/```(\w*)\n?([\s\S]*?)```/g);
    const nodes = [];

    for (let i = 0; i < parts.length; i += 3) {
        if (parts[i]?.trim()) {
            nodes.push(<div key={`t${i}`}>{renderLines(parts[i])}</div>);
        }

        if (i + 2 < parts.length) {
            nodes.push(<CodeBlock key={`c${i}`} language={parts[i + 1]} code={parts[i + 2].trim()} />);
        }
    }

    return nodes;
};

// a short line for everything the assistant did for the user
const stepLabel = (e) => {
    if (e.type === "project") return `Project "${e.project?.name}" created`;
    if (e.type === "collection") return `Collection "${e.name}" added`;
    if (e.type === "apiKey") return "API key generated";
    return "";
};

const ChatPopup = () => {
    const { user } = useAuth();
    const { selectedProject, setSelectedProject } = useProject();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([GREETING]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);

    // the project waiting for the user's confirmation to be deleted
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    // always scroll to the newest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending, open]);

    // put the cursor in the input when the popup opens
    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    // lets other pages open the popup, for example the dashboard
    useEffect(() => {
        const handleOpen = () => setOpen(true);

        window.addEventListener("open-chat", handleOpen);
        return () => window.removeEventListener("open-chat", handleOpen);
    }, []);

    const sendPrompt = async (text) => {
        const prompt = text.trim();
        if (!prompt || sending) return;

        // the earlier messages (without the greeting), so the assistant remembers the chat
        const history = messages
            .slice(1)
            .filter((m) => !m.error)
            .slice(-8)
            .map((m) => ({ role: m.role, text: m.text }));

        setMessages((prev) => [...prev, { role: "user", text: prompt }]);
        setInput("");
        setSending(true);

        try {
            const res = await api.post("/askAI", {
                prompt,
                history,
                context: {
                    selectedProject: selectedProject
                        ? { id: selectedProject._id, name: selectedProject.name }
                        : null,
                },
            });
            const { answer, effects = [] } = res.data.data;

            // apply what the assistant did for the user
            effects.forEach((e) => {
                if (e.type === "project") setSelectedProject(e.project);

                // the assistant never deletes by itself, the user must confirm in the box
                if (e.type === "confirmDelete") setPendingDelete(e.project);

                if (e.type === "apiKey") {
                    // the same keys the Collections page reads, so the key shows up there
                    localStorage.setItem(`apiKeyData_${e.projectId}`, JSON.stringify({ id: e.keyId, value: e.value }));
                    localStorage.setItem(`apiKeyCreated_${e.projectId}`, "true");
                }
            });

            // tell the open pages (like Collections) to reload
            if (effects.length > 0) window.dispatchEvent(new Event("backora-data-changed"));

            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: answer, steps: effects.map(stepLabel).filter(Boolean) },
            ]);
        } catch (error) {
            const data = error.response?.data;

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: data?.message || "Sorry, something went wrong. Please try again.",
                    error: true,
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    // the user clicked Delete in the confirmation box
    const handleConfirmDelete = async () => {
        if (!pendingDelete || deleting) return;

        const project = pendingDelete;
        setDeleting(true);

        try {
            await api.delete(`/deleteProject/${project.id}`);

            // clean up what is saved in this browser for the project
            localStorage.removeItem(`apiKeyCreated_${project.id}`);
            localStorage.removeItem(`apiKeyData_${project.id}`);
            if (selectedProject?._id === project.id) setSelectedProject(null);

            window.dispatchEvent(new Event("backora-data-changed"));

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: `Done. The project "${project.name}" and its collections, data and API key were deleted.`,
                },
            ]);
        } catch (error) {
            const data = error.response?.data;

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: data?.message || "Sorry, the project could not be deleted. Please try again.",
                    error: true,
                },
            ]);
        } finally {
            setDeleting(false);
            setPendingDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setPendingDelete(null);

        setMessages((prev) => [
            ...prev,
            { role: "assistant", text: "Okay, I did not delete anything." },
        ]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendPrompt(input);
    };

    // the assistant is only for signed-in users (the backend route needs a login too)
    if (!user) return null;

    return (
        <>
            {/* Popup */}
            {open && (
                <div className="fixed bottom-24 right-6 z-[55] w-[calc(100vw-3rem)] sm:w-96 h-[34rem] max-h-[calc(100vh-7rem)] flex flex-col bg-[#0b0b0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3 text-white bg-gradient-to-br from-pink-600 to-rose-500">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
                                <Logo className="w-5 h-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="font-semibold text-sm leading-tight">Backora Assistant</p>
                                <p className="text-xs opacity-80 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                                    Online · Powered by Gemini
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Clear chat */}
                            <button
                                type="button"
                                onClick={() => setMessages([GREETING])}
                                disabled={sending || messages.length === 1}
                                aria-label="Clear chat"
                                title="Clear chat"
                                className="opacity-80 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>

                            {/* Close */}
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close assistant"
                                className="opacity-80 hover:opacity-100"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="chat-scroll flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {messages.map((m, i) =>
                            m.role === "user" ? (
                                <div
                                    key={i}
                                    className="self-end max-w-[85%] px-4 py-2.5 text-sm leading-6 whitespace-pre-wrap break-words text-white bg-gradient-to-br from-pink-600 to-rose-500 rounded-2xl rounded-tr-sm"
                                >
                                    {m.text}
                                </div>
                            ) : (
                                <div key={i} className="self-start flex items-start gap-2 max-w-[94%]">
                                    <div className="w-7 h-7 shrink-0 mt-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center">
                                        <Logo className="w-4 h-4" />
                                    </div>

                                    <div className={`min-w-0 bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-6 break-words ${m.error ? "text-pink-300" : ""}`}>
                                        {m.error ? m.text : renderMessage(m.text)}

                                        {m.steps?.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5 text-xs">
                                                {m.steps.map((step, n) => (
                                                    <div key={n} className="flex items-center gap-1.5 text-pink-300">
                                                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20 6 9 17l-5-5" />
                                                        </svg>
                                                        <span>{step}</span>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => router.push("/collection")}
                                                    className="self-start mt-1 border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 rounded-full px-3 py-1.5"
                                                >
                                                    Open collections →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        )}

                        {/* Quick questions, only before the first message */}
                        {messages.length === 1 && !sending && (
                            <div className="flex flex-col gap-2 pl-9">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => sendPrompt(s)}
                                        className="self-start text-left text-xs border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 rounded-full px-3 py-1.5"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Typing indicator */}
                        {sending && (
                            <div className="self-start flex items-start gap-2">
                                <div className="w-7 h-7 shrink-0 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center">
                                    <Logo className="w-4 h-4" />
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
                                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
                                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 p-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask something..."
                            maxLength={2000}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-pink-500"
                        />

                        <button
                            type="submit"
                            disabled={sending || !input.trim()}
                            aria-label="Send message"
                            className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m22 2-7 20-4-9-9-4Z" />
                                <path d="M22 2 11 13" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            {/* Delete confirmation box */}
            {pendingDelete && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center px-4"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                    <div className="w-full max-w-sm bg-[#0b0b0f] border border-white/10 rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </div>

                        <h2 className="text-xl font-semibold mt-5">Delete project?</h2>

                        <p className="text-white/60 text-sm mt-2">
                            Are you sure you want to delete{" "}
                            <span className="text-white font-medium">{pendingDelete.name}</span>?
                            Its collections, data and API key will be deleted permanently. This cannot be undone.
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleCancelDelete}
                                disabled={deleting}
                                className="flex-1 border border-white/20 hover:bg-white/10 font-medium text-sm rounded-lg px-5 py-3 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="flex-1 text-white bg-gradient-to-br from-rose-600 to-red-600 hover:bg-gradient-to-bl font-medium text-sm rounded-lg px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Round button in the corner */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close assistant" : "Open assistant"}
                className="fixed bottom-6 right-6 z-[55] w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl shadow-lg"
            >
                {open ? (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>
        </>
    );
};

export default ChatPopup;









// "use client";

// import React, { useState, useRef, useEffect } from "react";

// import api from "@/app/lib/api";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/authContext";
// import { useProject } from "@/app/context/projectContext";

// const GREETING = {
//     role: "assistant",
//     text: "Hi! I'm the Backora assistant. Ask me anything about projects, collections or API keys.",
// };

// // quick questions shown before the first message
// const SUGGESTIONS = [
//     "Create a project called todo-list with an API key",
//     "How do I generate an API key?",
//     "What are collections?",
// ];

// // the Backora logo mark
// const Logo = ({ className }) => (
//     <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//         <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h6.2a5.3 5.3 0 0 1 3.1 9.6A5.6 5.6 0 0 1 13.4 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
//     </svg>
// );

// // a code block with a Copy button
// const CodeBlock = ({ language, code }) => {
//     const [copied, setCopied] = useState(false);

//     const handleCopy = async () => {
//         await navigator.clipboard.writeText(code);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 1500);
//     };

//     return (
//         <div className="my-2 rounded-xl overflow-hidden border border-white/10 bg-black/40">
//             <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 text-[11px] text-white/60">
//                 <span>{language || "code"}</span>
//                 <button type="button" onClick={handleCopy} className="hover:text-pink-400">
//                     {copied ? "Copied!" : "Copy"}
//                 </button>
//             </div>
//             <pre className="chat-scroll p-3 overflow-x-auto text-xs leading-5 font-mono text-pink-300">{code}</pre>
//         </div>
//     );
// };

// // **bold** and `code` inside a line
// const renderInline = (text) =>
//     text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
//         if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
//             return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
//         }
//         if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
//             return <code key={i} className="px-1 py-0.5 rounded bg-white/10 font-mono text-[12px] text-pink-300">{part.slice(1, -1)}</code>;
//         }
//         return part;
//     });

// // paragraphs, bullet lists, numbered lists and headings
// const renderLines = (text) =>
//     text.trim().split("\n").map((line, i) => {
//         const bullet = line.match(/^\s*[-*]\s+(.*)/);
//         const numbered = line.match(/^\s*(\d+)\.\s+(.*)/);
//         const heading = line.match(/^#{1,3}\s+(.*)/);

//         if (!line.trim()) return <div key={i} className="h-2" />;

//         if (bullet) {
//             return (
//                 <div key={i} className="flex gap-2 pl-1">
//                     <span className="text-pink-400">•</span>
//                     <span className="min-w-0">{renderInline(bullet[1])}</span>
//                 </div>
//             );
//         }

//         if (numbered) {
//             return (
//                 <div key={i} className="flex gap-2 pl-1">
//                     <span className="text-pink-400 shrink-0">{numbered[1]}.</span>
//                     <span className="min-w-0">{renderInline(numbered[2])}</span>
//                 </div>
//             );
//         }

//         if (heading) return <p key={i} className="font-semibold mt-1">{renderInline(heading[1])}</p>;

//         return <p key={i}>{renderInline(line)}</p>;
//     });

// // splits an answer into normal text and ```code``` blocks
// const renderMessage = (text) => {
//     const parts = text.split(/```(\w*)\n?([\s\S]*?)```/g);
//     const nodes = [];

//     for (let i = 0; i < parts.length; i += 3) {
//         if (parts[i]?.trim()) {
//             nodes.push(<div key={`t${i}`}>{renderLines(parts[i])}</div>);
//         }

//         if (i + 2 < parts.length) {
//             nodes.push(<CodeBlock key={`c${i}`} language={parts[i + 1]} code={parts[i + 2].trim()} />);
//         }
//     }

//     return nodes;
// };

// // a short line for everything the assistant did for the user
// const stepLabel = (e) => {
//     if (e.type === "project") return `Project "${e.project?.name}" created`;
//     if (e.type === "collection") return `Collection "${e.name}" added`;
//     if (e.type === "apiKey") return "API key generated";
//     return "";
// };

// const ChatPopup = () => {
//     const { user } = useAuth();
//     const { selectedProject, setSelectedProject } = useProject();
//     const router = useRouter();

//     const [open, setOpen] = useState(false);
//     const [messages, setMessages] = useState([GREETING]);
//     const [input, setInput] = useState("");
//     const [sending, setSending] = useState(false);

//     // the project waiting for the user's confirmation to be deleted
//     const [pendingDelete, setPendingDelete] = useState(null);
//     const [deleting, setDeleting] = useState(false);

//     const bottomRef = useRef(null);
//     const inputRef = useRef(null);

//     // always scroll to the newest message
//     useEffect(() => {
//         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages, sending, open]);

//     // put the cursor in the input when the popup opens
//     useEffect(() => {
//         if (open) inputRef.current?.focus();
//     }, [open]);

//     // lets other pages open the popup, for example the dashboard
//     useEffect(() => {
//         const handleOpen = () => setOpen(true);

//         window.addEventListener("open-chat", handleOpen);
//         return () => window.removeEventListener("open-chat", handleOpen);
//     }, []);

//     const sendPrompt = async (text) => {
//         const prompt = text.trim();
//         if (!prompt || sending) return;

//         // the earlier messages (without the greeting), so the assistant remembers the chat
//         const history = messages
//             .slice(1)
//             .filter((m) => !m.error)
//             .slice(-8)
//             .map((m) => ({ role: m.role, text: m.text }));

//         setMessages((prev) => [...prev, { role: "user", text: prompt }]);
//         setInput("");
//         setSending(true);

//         try {
//             const res = await api.post("/askAI", {
//                 prompt,
//                 history,
//                 context: {
//                     selectedProject: selectedProject
//                         ? { id: selectedProject._id, name: selectedProject.name }
//                         : null,
//                 },
//             });
//             const { answer, effects = [] } = res.data.data;

//             // apply what the assistant did for the user
//             effects.forEach((e) => {
//                 if (e.type === "project") setSelectedProject(e.project);

//                 // the assistant never deletes by itself, the user must confirm in the box
//                 if (e.type === "confirmDelete") setPendingDelete(e.project);

//                 if (e.type === "apiKey") {
//                     // the same keys the Collections page reads, so the key shows up there
//                     localStorage.setItem(`apiKeyData_${e.projectId}`, JSON.stringify({ id: e.keyId, value: e.value }));
//                     localStorage.setItem(`apiKeyCreated_${e.projectId}`, "true");
//                 }
//             });

//             // tell the open pages (like Collections) to reload
//             if (effects.length > 0) window.dispatchEvent(new Event("backora-data-changed"));

//             setMessages((prev) => [
//                 ...prev,
//                 { role: "assistant", text: answer, steps: effects.map(stepLabel).filter(Boolean) },
//             ]);
//         } catch (error) {
//             const data = error.response?.data;

//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     role: "assistant",
//                     text: data?.message || "Sorry, something went wrong. Please try again.",
//                     error: true,
//                 },
//             ]);
//         } finally {
//             setSending(false);
//         }
//     };

//     // the user clicked Delete in the confirmation box
//     const handleConfirmDelete = async () => {
//         if (!pendingDelete || deleting) return;

//         const project = pendingDelete;
//         setDeleting(true);

//         try {
//             await api.delete(`/deleteProject/${project.id}`);

//             // clean up what is saved in this browser for the project
//             localStorage.removeItem(`apiKeyCreated_${project.id}`);
//             localStorage.removeItem(`apiKeyData_${project.id}`);
//             if (selectedProject?._id === project.id) setSelectedProject(null);

//             window.dispatchEvent(new Event("backora-data-changed"));

//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     role: "assistant",
//                     text: `Done. The project "${project.name}" and its collections, data and API key were deleted.`,
//                 },
//             ]);
//         } catch (error) {
//             const data = error.response?.data;

//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     role: "assistant",
//                     text: data?.message || "Sorry, the project could not be deleted. Please try again.",
//                     error: true,
//                 },
//             ]);
//         } finally {
//             setDeleting(false);
//             setPendingDelete(null);
//         }
//     };

//     const handleCancelDelete = () => {
//         setPendingDelete(null);

//         setMessages((prev) => [
//             ...prev,
//             { role: "assistant", text: "Okay, I did not delete anything." },
//         ]);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         sendPrompt(input);
//     };

//     // the assistant is only for signed-in users (the backend route needs a login too)
//     if (!user) return null;

//     return (
//         <>
//             {/* Popup */}
//             {open && (
//                 <div className="fixed bottom-24 right-6 z-[55] w-[calc(100vw-3rem)] sm:w-96 h-[34rem] max-h-[calc(100vh-7rem)] flex flex-col bg-[#0b0b0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

//                     {/* Header */}
//                     <div className="flex items-center justify-between gap-3 px-4 py-3 text-white bg-gradient-to-br from-pink-600 to-rose-500">
//                         <div className="flex items-center gap-3 min-w-0">
//                             <div className="w-9 h-9 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
//                                 <Logo className="w-5 h-5" />
//                             </div>

//                             <div className="min-w-0">
//                                 <p className="font-semibold text-sm leading-tight">Backora Assistant</p>
//                                 <p className="text-xs opacity-80 flex items-center gap-1.5">
//                                     <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
//                                     Online · Powered by Gemini
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-3 shrink-0">
//                             {/* Clear chat */}
//                             <button
//                                 type="button"
//                                 onClick={() => setMessages([GREETING])}
//                                 disabled={sending || messages.length === 1}
//                                 aria-label="Clear chat"
//                                 title="Clear chat"
//                                 className="opacity-80 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed"
//                             >
//                                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <path d="M3 6h18" />
//                                     <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
//                                     <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                                 </svg>
//                             </button>

//                             {/* Close */}
//                             <button
//                                 type="button"
//                                 onClick={() => setOpen(false)}
//                                 aria-label="Close assistant"
//                                 className="opacity-80 hover:opacity-100"
//                             >
//                                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <path d="M18 6 6 18" />
//                                     <path d="m6 6 12 12" />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>

//                     {/* Messages */}
//                     <div className="chat-scroll flex-1 overflow-y-auto p-4 flex flex-col gap-4">
//                         {messages.map((m, i) =>
//                             m.role === "user" ? (
//                                 <div
//                                     key={i}
//                                     className="self-end max-w-[85%] px-4 py-2.5 text-sm leading-6 whitespace-pre-wrap break-words text-white bg-gradient-to-br from-pink-600 to-rose-500 rounded-2xl rounded-tr-sm"
//                                 >
//                                     {m.text}
//                                 </div>
//                             ) : (
//                                 <div key={i} className="self-start flex items-start gap-2 max-w-[94%]">
//                                     <div className="w-7 h-7 shrink-0 mt-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center">
//                                         <Logo className="w-4 h-4" />
//                                     </div>

//                                     <div className={`min-w-0 bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-6 break-words ${m.error ? "text-pink-300" : ""}`}>
//                                         {m.error ? m.text : renderMessage(m.text)}

//                                         {m.steps?.length > 0 && (
//                                             <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5 text-xs">
//                                                 {m.steps.map((step, n) => (
//                                                     <div key={n} className="flex items-center gap-1.5 text-pink-300">
//                                                         <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                                                             <path d="M20 6 9 17l-5-5" />
//                                                         </svg>
//                                                         <span>{step}</span>
//                                                     </div>
//                                                 ))}

//                                                 <button
//                                                     type="button"
//                                                     onClick={() => router.push("/collection")}
//                                                     className="self-start mt-1 border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 rounded-full px-3 py-1.5"
//                                                 >
//                                                     Open collections →
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )
//                         )}

//                         {/* Quick questions, only before the first message */}
//                         {messages.length === 1 && !sending && (
//                             <div className="flex flex-col gap-2 pl-9">
//                                 {SUGGESTIONS.map((s) => (
//                                     <button
//                                         key={s}
//                                         type="button"
//                                         onClick={() => sendPrompt(s)}
//                                         className="self-start text-left text-xs border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 rounded-full px-3 py-1.5"
//                                     >
//                                         {s}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}

//                         {/* Typing indicator */}
//                         {sending && (
//                             <div className="self-start flex items-start gap-2">
//                                 <div className="w-7 h-7 shrink-0 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center">
//                                     <Logo className="w-4 h-4" />
//                                 </div>

//                                 <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1">
//                                     <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
//                                     <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
//                                     <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
//                                 </div>
//                             </div>
//                         )}

//                         <div ref={bottomRef} />
//                     </div>

//                     {/* Input */}
//                     <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 p-3">
//                         <input
//                             ref={inputRef}
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder="Ask something..."
//                             maxLength={2000}
//                             className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-pink-500"
//                         />

//                         <button
//                             type="submit"
//                             disabled={sending || !input.trim()}
//                             aria-label="Send message"
//                             className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="m22 2-7 20-4-9-9-4Z" />
//                                 <path d="M22 2 11 13" />
//                             </svg>
//                         </button>
//                     </form>
//                 </div>
//             )}

//             {/* Delete confirmation box */}
//             {pendingDelete && (
//                 <div
//                     className="fixed inset-0 z-[70] flex items-center justify-center px-4"
//                     style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
//                 >
//                     <div className="w-full max-w-sm bg-[#0b0b0f] border border-white/10 rounded-2xl p-6 text-center">
//                         <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
//                             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <path d="M3 6h18" />
//                                 <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
//                                 <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//                             </svg>
//                         </div>

//                         <h2 className="text-xl font-semibold mt-5">Delete project?</h2>

//                         <p className="text-white/60 text-sm mt-2">
//                             Are you sure you want to delete{" "}
//                             <span className="text-white font-medium">{pendingDelete.name}</span>?
//                             Its collections, data and API key will be deleted permanently. This cannot be undone.
//                         </p>

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 type="button"
//                                 onClick={handleCancelDelete}
//                                 disabled={deleting}
//                                 className="flex-1 border border-white/20 hover:bg-white/10 font-medium text-sm rounded-lg px-5 py-3 disabled:opacity-50"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="button"
//                                 onClick={handleConfirmDelete}
//                                 disabled={deleting}
//                                 className="flex-1 text-white bg-gradient-to-br from-rose-600 to-red-600 hover:bg-gradient-to-bl font-medium text-sm rounded-lg px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {deleting ? "Deleting..." : "Delete"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Round button in the corner */}
//             <button
//                 type="button"
//                 onClick={() => setOpen(!open)}
//                 aria-label={open ? "Close assistant" : "Open assistant"}
//                 className="fixed bottom-6 right-6 z-[55] w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-pink-600 to-rose-500 hover:bg-gradient-to-bl shadow-lg"
//             >
//                 {open ? (
//                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="m6 9 6 6 6-6" />
//                     </svg>
//                 ) : (
//                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//                     </svg>
//                 )}
//             </button>
//         </>
//     );
// };

// export default ChatPopup;

