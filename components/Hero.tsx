"use client";
import React, { useEffect, useRef } from "react";
import { useParallax } from "@/hooks/useScrollAnimation";
import AnimatedButton from "./AnimatedButton";
import SplitText from "./SplitText";
import { gsap } from "gsap";
import { shouldReduceMotion } from "@/utils/animations";

import Scene3D from "./Scene3D";

export default function Hero() {
    const shape1Ref = useParallax(-0.3);
    const shape2Ref = useParallax(0.2);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current || shouldReduceMotion()) return;

        const elements = contentRef.current.querySelectorAll('.animate-in');

        gsap.fromTo(
            elements,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.3,
            }
        );
    }, []);

    return (
        <section className="relative overflow-clip w-full px-[3vw] max-md:px-[6vw]">
            <Scene3D />
            <div className="h-screen relative overflow-y-clip flex items-center">
                {/* Abstract 3D shape placeholders with parallax */}
                <div
                    ref={shape1Ref}
                    className="size-[25vh] hidden max-md:block -rotate-180 absolute top-0 right-[-10vw] grayscale opacity-50"
                >
                    <div className="w-full h-full rounded-full border border-black/10 animate-spin-slow"></div>
                </div>
                <div
                    ref={shape2Ref}
                    className="visible max-md:hidden size-[20vw] absolute bottom-0 grayscale opacity-50 left-[10vw]"
                >
                    <div className="w-full h-full rounded-full border border-black/10 animate-bounce"></div>
                </div>

                {/* Center Line */}
                <div className="w-px h-full absolute top-0 left-1/2 -translate-x-1/2 bg-zinc-500/30"></div>

                <div ref={contentRef} className="h-fit flex flex-col-reverse md:flex-row justify-between gap-[5vh] md:gap-0 w-full relative z-10">
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <div className="w-full md:w-4/5 animate-in">
                            <div className="reveal-text">
                                <div>
                                    <p className="font-sans w-full text-[4vw] max-md:w-[90%] md:text-[1.3vw] font-medium">
                                        We design immersive, motion-driven websites that command attention and guide users to act. Clean builds. Sharp strategy. Zero fluff.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[5vh] animate-in">
                            <AnimatedButton
                                href="/contact"
                                variant="primary"
                                magnetic={true}
                                ripple={true}
                                className="text-[4vw] md:text-[1.5vw]"
                            >
                                Let's Talk
                            </AnimatedButton>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 pl-[3vw] max-md:pl-0 text-[16vw] md:text-[8vw] leading-none font-semibold font-display uppercase animate-in">
                        <div className="fall-text">
                            <div>
                                <h1>
                                    Your Brand <span className="text-lime-400">Deserves</span> More Than a Pretty Website.
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
