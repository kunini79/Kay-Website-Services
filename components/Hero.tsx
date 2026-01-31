"use client";
import React, { useEffect, useRef } from "react";
import { useParallax } from "@/hooks/useScrollAnimation";
import AnimatedButton from "./AnimatedButton";
import SplitText from "./SplitText";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { shouldReduceMotion } from "@/utils/animations";

import Scene3D from "./Scene3D";

export default function Hero() {
    const shape1Ref = useParallax(-0.3);
    const shape2Ref = useParallax(0.2);
    const contentRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Intro Sequence
        if (introRef.current) {
            tl.to(introRef.current, {
                opacity: 1,
                duration: 0.5,
            })
                .to(introRef.current.querySelector('.intro-text'), {
                    scale: 1,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power2.out"
                })
                .to(introRef.current.querySelector('.intro-text'), {
                    opacity: 0,
                    filter: "blur(10px)",
                    scale: 1.1,
                    duration: 1,
                    delay: 0.5
                })
                .to(introRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    pointerEvents: "none"
                });
        }

        // 2. Main Content Reveal (Overlapping slightly with intro fade out)
        if (contentRef.current && !shouldReduceMotion()) {
            const elements = contentRef.current.querySelectorAll('.animate-in');

            tl.fromTo(
                elements,
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: "power3.out", // cubic-bezier(0.16, 1, 0.3, 1) approx
                },
                "-=0.5" // Start before intro completely fades
            );
        }
    }, { scope: contentRef }); // Scope properly if using useGSAP, checking imports below

    // Note: useGSAP is cleaner but we were using useEffect. Switching to useGSAP for better cleanup if available or sticking to useEffect for consistency. 
    // The file imports `useEffect`. I will stick to usage in file if useGSAP isn't imported, but looking at previous file view it had `useEffect`.
    // Wait, step 414 showed `import { gsap } from "gsap";`. I see `useGSAP` in step 423 (Work.tsx). 
    // I should add `import { useGSAP } from "@gsap/react";` to Hero.tsx first or just use useEffect. 
    // I'll stick to useEffect for now to minimize import changes unless I see it's easy. 
    // Actually, let's use useEffect to be safe with existing imports.

    useEffect(() => {
        const tl = gsap.timeline();

        // Intro
        if (introRef.current) {
            tl.set(introRef.current, { opacity: 1 });
            tl.fromTo(introRef.current.querySelector('.intro-text'),
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
            )
                .to(introRef.current.querySelector('.intro-text'), {
                    opacity: 0,
                    filter: "blur(10px)",
                    scale: 1.1,
                    duration: 1,
                    delay: 1.5
                })
                .to(introRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        if (introRef.current) introRef.current.style.display = 'none';
                    }
                });
        }

        // Content Reveal
        if (contentRef.current && !shouldReduceMotion()) {
            const elements = contentRef.current.querySelectorAll('.animate-in');
            tl.fromTo(elements,
                { opacity: 0, y: 50, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: "power3.out",
                    delay: -0.5
                }
            );
        }
    }, []);

    return (
        <section className="relative overflow-clip w-full px-[3vw] max-md:px-[6vw]">
            {/* INTRO OVERLAY */}
            <div ref={introRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-white pointer-events-none">
                <div className="intro-text opacity-0 font-display font-bold text-[10vw] md:text-[5vw] uppercase tracking-tighter text-black">
                    KayCorp
                </div>
            </div>

            <Scene3D />
            <div className="h-screen relative overflow-y-clip flex items-center">
                {/* ... existing shapes ... */}
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
                        <div className="w-full md:w-4/5 animate-in opacity-0">
                            <div className="reveal-text">
                                <div>
                                    <p className="font-sans w-full text-[4.5vw] max-md:text-base max-md:leading-relaxed max-md:w-full md:text-[1.3vw] font-medium leading-relaxed">
                                        We design immersive, motion-driven websites that command attention and guide users to act. Clean builds. Sharp strategy. Zero fluff.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[5vh] animate-in opacity-0">
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

                    <div className="w-full md:w-1/2 pl-[3vw] max-md:pl-0 text-[16vw] md:text-[8vw] leading-none font-semibold font-display uppercase animate-in opacity-0">
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

            {/* Marquee Text Section removed */}
        </section>
    );
}
