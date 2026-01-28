"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
            setIsVisible(window.scrollY > 100);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`fixed top-0 left-0 right-0 h-1 bg-lime-400 z-[9999] transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
            style={{
                width: `${scrollProgress}%`,
                transformOrigin: "left",
            }}
        />
    );
}
