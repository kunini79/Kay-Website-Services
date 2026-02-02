"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Pusher from "pusher-js";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PUSHER_KEY = "2e2a115faa09f16baa5b"; // From reference code
const PUSHER_CLUSTER = "ap2";

export default function MobileSync() {
    const [sessionId, setSessionId] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const pusherRef = useRef<Pusher | null>(null);

    useEffect(() => {
        // Generate unique session ID on mount
        const id = Math.random().toString(36).substring(2, 10);
        setSessionId(id);

        // Initialize Pusher
        const pusher = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe(`session-${id}`);

        channel.bind("mobile-connected", () => {
            setIsConnected(true);
            setShowQR(false); // Hide QR when connected? Or keep it?
        });

        channel.bind("remote-command", (data: { command: string; value?: any }) => {
            console.log("Received command:", data);
            handleCommand(data);
        });

        pusherRef.current = pusher;

        return () => {
            pusher.disconnect();
        };
    }, []);

    const handleCommand = (data: { command: string; value?: any }) => {
        const { command, value } = data;
        if (command === "scroll") {
            // Scroll by amount
            window.scrollBy({ top: value * 5, behavior: "auto" }); // Multiplier for speed
        } else if (command === "navigate") {
            router.push(value);
        }
    };

    useGSAP(() => {
        if (showQR) {
            gsap.to(containerRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        } else {
            gsap.to(containerRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            });
        }
    }, [showQR]);

    const controllerUrl = typeof window !== "undefined" ? `${window.location.origin}/controller/${sessionId}` : "";

    return (
        <>
            <div className="fixed bottom-4 left-4 z-[9000]">
                <button
                    onClick={() => setShowQR(!showQR)}
                    className={`px-4 py-2 rounded-full font-display font-semibold uppercase tracking-wider text-sm transition-colors ${isConnected ? "bg-lime-400 text-black" : "dark:bg-zinc-900 dark:text-white bg-white text-black"
                        }`}
                >
                    {isConnected ? "Phone Connected" : "Sync Phone"}
                </button>
            </div>

            <div
                ref={containerRef}
                className="fixed bottom-16 left-4 z-[9000] p-4 rounded-xl shadow-2xl opacity-0 translate-y-5 pointer-events-none dark:bg-zinc-900"
                style={{ backgroundColor: "var(--background)", pointerEvents: showQR ? "auto" : "none" }}
            >
                {sessionId && (
                    <div className="flex flex-col items-center gap-2">
                        <QRCodeSVG value={controllerUrl} size={150} />
                        <p className="text-xs font-sans text-gray-500 uppercase tracking-widest mt-2">{isConnected ? "Connected" : "Scan to Control"}</p>
                    </div>
                )}
            </div>
        </>
    );
}
