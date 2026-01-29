"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Overlay */}
            <div className={`fixed flex flex-col items-center justify-center bottom-24 max-md:bottom-20 left-1/2 -translate-x-1/2 z-[140] w-[40vw] min-w-[500px] max-md:w-[90vw] max-md:min-w-0 min-h-[300px] max-md:min-h-auto transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div
                    className="absolute inset-0 bg-black rounded-[0.5vw] max-md:rounded-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]"
                    style={{
                        transform: isOpen ? "scale(1)" : "scale(0)",
                        opacity: isOpen ? 1 : 0,
                        transformOrigin: "center bottom"
                    }}
                ></div>

                <div className={`relative p-6 max-md:p-4 z-10 w-full transition-opacity duration-300 delay-100 ${isOpen ? "opacity-100" : "opacity-0"}`}>
                    <div className="grid grid-cols-2 gap-4 max-md:gap-3 w-full">
                        <div className="flex flex-col items-stretch max-md:items-stretch justify-center gap-3 max-md:gap-2">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Services", href: "/#services" },
                                { name: "Process", href: "/#process" },
                                { name: "Work", href: "/#work" }
                            ].map((item, index) => (
                                <div
                                    key={item.name}
                                    className="cursor-pointer relative z-10 w-full"
                                    style={{
                                        opacity: isOpen ? 1 : 0,
                                        transform: isOpen ? "translateY(0)" : "translateY(20px)",
                                        transition: `all 0.5s cubic-bezier(0.87, 0, 0.13, 1) ${0.1 + index * 0.05}s`
                                    }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Link href={item.href} className="block w-full">
                                        <div className="bg-[#BBFD6A] rounded-lg px-6 py-3 max-md:px-4 max-md:py-2.5 flex items-center justify-center w-full group hover:bg-[#a9e65e] transition-colors">
                                            <span
                                                className="relative overflow-clip inline-block"
                                                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                                            >
                                                <span
                                                    className="text-black font-display text-[1.5vw] max-md:text-xl uppercase font-semibold whitespace-nowrap text-center block transition-transform duration-300 group-hover:-translate-y-full"
                                                    style={{ transformStyle: "preserve-3d" }}
                                                >
                                                    {item.name}
                                                </span>
                                                <span
                                                    className="text-black font-display text-[1.5vw] max-md:text-xl uppercase font-semibold whitespace-nowrap text-center block absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0"
                                                    style={{ transformStyle: "preserve-3d" }}
                                                >
                                                    {item.name}
                                                </span>
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}

                            {/* Mobile Contact Link (only visible on mobile) */}
                            <div
                                className="cursor-pointer relative z-10 hidden max-md:block"
                                style={{
                                    opacity: isOpen ? 1 : 0,
                                    transform: isOpen ? "translateY(0)" : "translateY(20px)",
                                    transition: "all 0.5s cubic-bezier(0.87, 0, 0.13, 1) 0.3s"
                                }}
                                onClick={() => setIsOpen(false)}
                            >
                                <Link href="/contact" className="block w-full">
                                    <div className="bg-[#BBFD6A] rounded-lg px-6 py-3 max-md:px-4 max-md:py-2.5 flex items-center justify-center group hover:bg-[#a9e65e] transition-colors">
                                        <span
                                            className="relative overflow-clip inline-block"
                                            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                                        >
                                            <span
                                                className="text-black font-display text-[1.5vw] max-md:text-xl uppercase font-semibold whitespace-nowrap text-center block transition-transform duration-300 group-hover:-translate-y-full"
                                                style={{ transformStyle: "preserve-3d" }}
                                            >
                                                Contact Us
                                            </span>
                                            <span
                                                className="text-black font-display text-[1.5vw] max-md:text-xl uppercase font-semibold whitespace-nowrap text-center block absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0"
                                                style={{ transformStyle: "preserve-3d" }}
                                            >
                                                Contact Us
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Right side placeholder - Control with phone etc */}
                        <div className="flex items-center justify-center">
                            <div
                                className="w-full h-full min-h-[15rem] max-md:min-h-[20rem] max-md:hidden rounded-lg flex flex-col items-center justify-center p-6 max-md:p-4 bg-white/5"
                                style={{
                                    opacity: isOpen ? 1 : 0,
                                    transform: isOpen ? "scale(1)" : "scale(0)",
                                    transition: "all 0.5s cubic-bezier(0.87, 0, 0.13, 1) 0.2s"
                                }}
                            >
                                <div className="bg-white rounded-lg p-4 max-md:p-3">
                                    <div className="w-40 h-40 max-md:w-32 max-md:h-32 bg-zinc-100 animate-pulse rounded"></div>
                                </div>
                                <div className="mt-4 max-md:mt-3 flex items-center gap-2 max-md:gap-2">
                                    <div className="w-2 h-2 max-md:w-2 max-md:h-2 rounded-full bg-zinc-500"></div>
                                    <p className="font-sans text-sm max-md:text-sm text-zinc-400">Control with phone</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="fixed bottom-6 max-md:bottom-4 left-1/2 -translate-x-1/2 w-[30vw] min-w-[400px] max-md:w-[90vw] max-md:min-w-0 bg-black rounded-[0.5vw] max-md:rounded-xl py-[.5vw] px-[1vw] max-md:py-3 max-md:px-4 flex items-center justify-between z-[150]">
                <div
                    className="flex items-center gap-[1vw] max-md:gap-3 cursor-pointer group"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="bg-[#BBFD6A] rounded-[0.2vw] max-md:rounded-md p-2 max-md:p-2 flex flex-col gap-1 max-md:gap-[3px] group-hover:scale-105 transition-transform">
                        <span className={`w-5 max-md:w-5 h-0.5 bg-black transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`}></span>
                        <span className={`w-5 max-md:w-5 h-0.5 bg-black transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
                        <span className={`w-5 max-md:w-5 h-0.5 bg-black transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}></span>
                    </div>
                    <span className="text-white font-sans font-semibold capitalize text-[1vw] max-md:text-sm max-md:block">
                        {isOpen ? "close" : "menu"}
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
                            KayCorp
                        </span>
                        <span
                            className="block absolute top-0 left-0 translate-y-full text-white font-sans font-semibold capitalize text-[1.5vw] max-md:text-lg transition-transform duration-300 group-hover:translate-y-0"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            KayCorp
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
