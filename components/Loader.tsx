"use client";
import React, { useEffect, useState } from "react";

export default function Loader({ onFinish }: { onFinish?: () => void }) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Simulate loading
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    setTimeout(() => {
                        if (onFinish) onFinish();
                        setTimeout(() => setShouldRender(false), 1000); // Unmount after animation
                    }, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onFinish]);

    if (!shouldRender) return null;

    return (
        <>
            <div
                className={`h-screen max-md:h-svh w-full fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-500 ${isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
                    } bg-white`}
            >
                {/* Background Shutters (Optional visual effect from original) */}
                <div className="absolute inset-0 flex pointer-events-none">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="box flex-1 bg-lime-400 origin-top h-full transition-transform duration-500" style={{ transform: isComplete ? 'scaleY(0)' : 'scaleY(1)' }}></div>
                    ))}
                </div>

                <div className="relative z-10 w-full h-full flex flex-col justify-between px-[3vw] py-[3vh] mix-blend-difference_DISABLED text-black">
                    {/* Top Bar */}
                    <div className="flex justify-between items-start">
                        <div className="overflow-hidden">
                            <h1 className="animate-text text-[8vw] md:text-[4vw] font-display font-semibold leading-none">
                                LOADING
                            </h1>
                        </div>
                        <div className="text-right overflow-hidden">
                            <p className="animate-text text-[3vw] md:text-[1vw] font-sans text-black/60 uppercase tracking-wider">
                                Please wait
                            </p>
                        </div>
                    </div>

                    {/* Center Percentage */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="relative overflow-hidden">
                            <span className="text-[35vw] md:text-[25vw] font-display font-semibold text-black leading-none inline-block">
                                {progress.toString().padStart(2, "0")}
                            </span>
                            <span className="animate-text absolute top-[2vw] right-[-8vw] md:right-[-5vw] text-[8vw] md:text-[4vw] font-display text-black">
                                %
                            </span>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex flex-col gap-[2vh]">
                        <div className="w-full h-[2px] bg-black/20 overflow-hidden origin-left">
                            <div
                                className="h-full bg-black transition-all duration-100 ease-out origin-left"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="overflow-hidden">
                                <p className="animate-text text-[3vw] md:text-[1vw] font-sans text-black/60 uppercase tracking-wider">
                                    Preparing experience
                                </p>
                            </div>
                            <div className="text-right overflow-hidden">
                                <p className="animate-text text-[4vw] md:text-[1.5vw] font-display text-black">
                                    LOADING ASSETS
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exit Transition Overlay (Second layer of shutters from reference) */}
            <div
                className="fixed top-0 left-0 w-full h-screen flex pointer-events-none z-[9999]"
            >
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-lime-400 transition-transform duration-700 ease-in-out delay-100"
                        style={{
                            transformOrigin: 'bottom',
                            transform: isComplete ? 'scaleY(0)' : 'scaleY(1)' // Logic inverted: they should start hidden or start visible? 
                            // In reference, they were visible. 
                        }}
                    ></div>
                ))}
            </div>
        </>
    );
}
