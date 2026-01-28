"use client";
import Link from "next/link";
import React from "react";

export default function Navigation() {
    return (
        <>
            {/* Mobile Menu Overlay - hidden by default for now, could implement toggle */}
            <div className="fixed flex flex-col items-center justify-center bottom-24 max-md:bottom-20 left-1/2 -translate-x-1/2 z-[140] w-[40vw] min-w-[500px] max-md:w-[90vw] max-md:min-w-0 min-h-[300px] max-md:min-h-auto transition-all duration-300 pointer-events-none">
                {/* Placeholder for menu content logic */}
            </div>

            <nav className="fixed bottom-6 max-md:bottom-4 left-1/2 -translate-x-1/2 w-[30vw] min-w-[400px] max-md:w-[90vw] max-md:min-w-0 bg-black rounded-[0.5vw] max-md:rounded-xl py-[.5vw] px-[1vw] max-md:py-3 max-md:px-4 flex items-center justify-between z-[150]">
                <div className="flex items-center gap-[1vw] max-md:gap-3 cursor-pointer group">
                    <div className="bg-[#BBFD6A] rounded-[0.2vw] max-md:rounded-md p-2 max-md:p-2 flex flex-col gap-1 max-md:gap-[3px] group-hover:scale-105 transition-transform">
                        <span className="w-5 max-md:w-5 h-0.5 bg-black transition-all duration-300 "></span>
                        <span className="w-5 max-md:w-5 h-0.5 bg-black transition-all duration-300 "></span>
                        <span className="w-5 max-md:w-5 h-0.5 bg-black transition-all duration-300 "></span>
                    </div>
                    <span className="text-white font-sans font-semibold capitalize text-[1vw] max-md:text-sm max-md:block">
                        menu
                    </span>
                </div>

                <Link href="/">
                    <span
                        className="relative overflow-clip inline-block cursor-pointer group"
                        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                    >
                        <span
                            className="block text-white font-sans font-semibold capitalize text-[1.5vw] max-md:text-lg transition-transform duration-300 group-hover:-translate-y-full"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            Anyflow
                        </span>
                        <span
                            className="block absolute top-0 left-0 translate-y-full text-white font-sans font-semibold capitalize text-[1.5vw] max-md:text-lg transition-transform duration-300 group-hover:translate-y-0"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            Anyflow
                        </span>
                    </span>
                </Link>

                <Link
                    className="bg-[#BBFD6A] font-sans text-[1.1vw] max-md:hidden text-black rounded-[0.2vw] px-4 py-2 font-semibold group"
                    href="/contact"
                >
                    <span
                        className="relative overflow-clip inline-block cursor-pointer"
                        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                    >
                        <span
                            className="block text-black font-sans font-semibold text-[1.1vw] transition-transform duration-300 group-hover:-translate-y-full"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            Contact Us
                        </span>
                        <span
                            className="block absolute top-0 left-0 translate-y-full text-black font-sans font-semibold text-[1.1vw] transition-transform duration-300 group-hover:translate-y-0"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            Contact Us
                        </span>
                    </span>
                </Link>
            </nav>
        </>
    );
}
