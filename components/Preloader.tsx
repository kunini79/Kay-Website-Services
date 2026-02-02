"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader() {
    const [percent, setPercent] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const progressToRef = useRef({ value: 0 });

    useGSAP(() => {
        // Check if we've already shown the preloader in this session
        const hasLoaded = sessionStorage.getItem("hasLoaded");
        if (hasLoaded) {
            if (containerRef.current) containerRef.current.style.display = "none";
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                setIsComplete(true);
                sessionStorage.setItem("hasLoaded", "true");
                // Remove from DOM after animation
                gsap.set(containerRef.current, { display: "none", delay: 0.5 });
            },
        });

        // Animate counter 0 -> 100 using a proxy object
        tl.to(progressToRef.current, {
            value: 100,
            duration: 3.5, // Reference had ~2.5s to 90 + burst
            ease: "power2.inOut",
            onUpdate: () => {
                setPercent(Math.round(progressToRef.current.value));
            },
        });

        // Exit animation: "Curtains" effect
        tl.to(
            ".preloader-curtain",
            {
                height: 0,
                duration: 0.8,
                stagger: {
                    amount: 0.2,
                    from: "edges",
                },
                ease: "power3.inOut",
            },
            "-=0.5" // Overlap with end of counter
        );

        // Fade out text
        tl.to(
            textRef.current,
            {
                opacity: 0,
                y: -50,
                duration: 0.5,
                ease: "power2.in",
            },
            "<" // Start with curtain
        );
    }, { scope: containerRef });

    if (isComplete && typeof window !== 'undefined' && sessionStorage.getItem("hasLoaded")) {
        // Return null to unmount if possible, or just let CSS hide it.
        // Current logic hides via CSS display: none.
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[10000] flex flex-col justify-between w-full h-screen pointer-events-auto"
        >
            {/* Curtains Background */}
            <div className="absolute inset-0 flex w-full h-full pointer-events-none z-[-1]">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="preloader-curtain flex-1 bg-lime-400 origin-top h-full w-full"></div>
                ))}
            </div>

            {/* Content */}
            <div ref={textRef} className="relative z-10 w-full h-full flex flex-col justify-between p-10 max-md:p-5" style={{ color: "var(--foreground)" }}>
                {/* Top Data */}
                <div className="flex justify-between items-start font-display font-semibold uppercase leading-none">
                    <h1 className="text-[4vw]">Loading</h1>
                    <p className="font-sans text-sm tracking-widest opacity-60">Please wait</p>
                </div>

                {/* Center Counter */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-start">
                    <span className="text-[20vw] leading-none font-display font-bold tracking-tighter">
                        {String(percent).padStart(2, '0')}
                    </span>
                    <span className="text-[4vw] font-display font-bold mt-[4vw]">%</span>
                </div>

                {/* Bottom Data */}
                <div className="flex justify-between items-end font-display uppercase font-semibold leading-none">
                    <p className="font-sans text-sm tracking-widest opacity-60">Preparing Experience</p>
                    <p className="text-[2vw]">{percent === 100 ? "Ready" : "Initializing..."}</p>
                </div>
            </div>
        </div>
    );
}
