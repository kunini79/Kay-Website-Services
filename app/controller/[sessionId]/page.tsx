"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function ControllerPage() {
    const { sessionId } = useParams();
    const [touchStart, setTouchStart] = useState(0);

    const sendCommand = async (command: string, value?: any) => {
        try {
            await fetch("/api/pusher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    event: "remote-command",
                    data: { command, value }
                })
            });
        } catch (e) {
            console.error("Failed to send command", e);
        }
    };

    // Notify connection on mount
    useEffect(() => {
        const connect = async () => {
            await fetch("/api/pusher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    event: "mobile-connected",
                    data: {}
                })
            });
        };
        if (sessionId) connect();
    }, [sessionId]);

    // Touch pad for scrolling
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const deltaY = touchStart - e.touches[0].clientY;
        // Throttling could be added here
        sendCommand("scroll", deltaY);
        setTouchStart(e.touches[0].clientY);
    };

    return (
        <div className="w-full h-screen bg-black text-white p-6 flex flex-col justify-between">
            <div className="text-center">
                <h1 className="text-4xl font-display font-bold uppercase text-lime-400">Controller</h1>
                <p className="font-sans text-sm opacity-50 mt-2">ID: {sessionId}</p>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
                <div
                    className="w-full h-[40vh] bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                >
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
                                <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
                            </div>
                            <p className="text-xs font-sans uppercase">Scroll Zone</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => sendCommand("navigate", "/#process")}
                        className="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-xl font-display font-semibold uppercase transition-colors"
                    >
                        Process
                    </button>
                    <button
                        onClick={() => sendCommand("navigate", "/#work")}
                        className="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-xl font-display font-semibold uppercase transition-colors"
                    >
                        Work
                    </button>
                    <button
                        onClick={() => sendCommand("navigate", "/")}
                        className="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-xl font-display font-semibold uppercase transition-colors"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => sendCommand("navigate", "/contact")}
                        className="bg-lime-400 text-black hover:bg-lime-300 p-6 rounded-xl font-display font-semibold uppercase transition-colors"
                    >
                        Contact
                    </button>
                </div>
            </div>
        </div>
    );
}
