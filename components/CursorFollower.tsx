"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { shouldReduceMotion } from "@/utils/animations";

export default function CursorFollower() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        if (shouldReduceMotion() || "ontouchstart" in window) return;

        const cursor = cursorRef.current;
        if (!cursor) return;

        const handleMouseMove = (e: MouseEvent) => {
            setIsVisible(true);
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.style.cursor === "pointer";

            setIsPointer(!!isInteractive);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseenter", handleMouseEnter, true);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseenter", handleMouseEnter, true);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    if (shouldReduceMotion() || "ontouchstart" in window) return null;

    return (
        <div
            ref={cursorRef}
            className={`fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference transition-all duration-200 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
            style={{
                transform: "translate(-50%, -50%)",
            }}
        >
            <div
                className={`rounded-full bg-lime-400 transition-all duration-300 ${isPointer ? "w-12 h-12" : "w-4 h-4"
                    }`}
            />
        </div>
    );
}
