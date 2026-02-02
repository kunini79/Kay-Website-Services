"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

function ThemeToggleContent() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 border border-current/20 bg-white/5 hover:bg-white/10 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md"
            aria-label="Toggle theme"
        >
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Sun Icon */}
                <svg
                    className={`absolute w-6 h-6 transition-all duration-500 ${
                        theme === "light"
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 rotate-180 scale-0"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>

                {/* Moon Icon */}
                <svg
                    className={`absolute w-6 h-6 transition-all duration-500 ${
                        theme === "dark"
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 -rotate-180 scale-0"
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </div>

            {/* Animated background ring */}
            <div className="absolute inset-0 rounded-full border border-lime-400/20 group-hover:border-lime-400/40 transition-all duration-300" />
        </button>
    );
}

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-14 h-14 rounded-full border border-current/20 bg-white/5 backdrop-blur-md" />
        );
    }

    return <ThemeToggleContent />;
}
