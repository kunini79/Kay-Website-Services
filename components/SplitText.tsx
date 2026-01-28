"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { shouldReduceMotion } from "@/utils/animations";

interface SplitTextProps {
    children: string;
    className?: string;
    delay?: number;
    stagger?: number;
    type?: "chars" | "words";
}

export default function SplitText({
    children,
    className = "",
    delay = 0,
    stagger = 0.03,
    type = "chars",
}: SplitTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || shouldReduceMotion()) return;

        const container = containerRef.current;
        const text = children;

        // Split text into characters or words
        const splits = type === "chars"
            ? text.split("")
            : text.split(" ");

        // Clear container and create spans
        container.innerHTML = "";

        splits.forEach((item, index) => {
            const span = document.createElement("span");
            span.textContent = type === "chars" ? item : item + " ";
            span.style.display = "inline-block";
            span.style.opacity = "0";
            container.appendChild(span);
        });

        const spans = container.querySelectorAll("span");

        // Animate in
        gsap.to(spans, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger,
            delay,
            ease: "power3.out",
        });

        return () => {
            gsap.killTweensOf(spans);
        };
    }, [children, delay, stagger, type]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
