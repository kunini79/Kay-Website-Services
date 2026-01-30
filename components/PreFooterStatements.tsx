"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type BlockSpec = {
    id: number;
    size: number;
    x: number;
    y: number;
    z: number;
    rotate: number;
};

export default function PreFooterStatements() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textOneRef = useRef<HTMLHeadingElement>(null);
    const textTwoRef = useRef<HTMLHeadingElement>(null);
    const blocksRef = useRef<HTMLDivElement[]>([]);

    const blocks = useMemo<BlockSpec[]>(() => {
        const items: BlockSpec[] = [];
        for (let i = 0; i < 28; i += 1) {
            items.push({
                id: i,
                size: 24 + (i % 7) * 8,
                x: (i % 7) * 12 + (i % 2 === 0 ? -8 : 8),
                y: (i % 4) * 12 + (i % 3 === 0 ? -6 : 6),
                z: (i % 5) * -30,
                rotate: i * 12,
            });
        }
        return items;
    }, []);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=200%",
                scrub: true,
                pin: true,
            },
        });

        tl.set([textOneRef.current, textTwoRef.current], { opacity: 0, y: 80 })
            .to(textOneRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power3.out",
            })
            .to(textOneRef.current, {
                opacity: 0,
                y: -80,
                duration: 0.4,
                ease: "power3.in",
            }, "+=0.25")
            .to(textTwoRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power3.out",
            }, ">-0.1")
            .to(textTwoRef.current, {
                opacity: 0,
                y: -80,
                duration: 0.4,
                ease: "power3.in",
            }, "+=0.25");

        if (blocksRef.current.length) {
            gsap.fromTo(
                blocksRef.current,
                { y: 0, rotateX: 0, rotateY: 0, z: 0, opacity: 1 },
                {
                    y: 320,
                    rotateX: -120,
                    rotateY: 80,
                    z: -220,
                    opacity: 0,
                    stagger: 0.03,
                    ease: "power3.in",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                        end: "bottom top",
                        scrub: true,
                    },
                }
            );
        }
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen bg-black overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ perspective: "1200px" }}
            >
                <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                    {blocks.map((block, index) => (
                        <div
                            key={block.id}
                            ref={(el) => {
                                if (el) blocksRef.current[index] = el;
                            }}
                            className="absolute bg-zinc-800/60 border border-zinc-700/60"
                            style={{
                                width: `${block.size}px`,
                                height: `${block.size}px`,
                                left: `${8 + (block.x * 5)}%`,
                                top: `${10 + (block.y * 5)}%`,
                                transform: `translateZ(${block.z}px) rotate(${block.rotate}deg)`,
                                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-center h-full text-center">
                <h2
                    ref={textOneRef}
                    className="text-white text-[16vw] md:text-[8vw] font-display font-bold uppercase tracking-tight"
                >
                    Built Different
                </h2>
                <h2
                    ref={textTwoRef}
                    className="absolute text-white text-[14vw] md:text-[7vw] font-display font-bold uppercase tracking-tight"
                >
                    Design with Purpose
                </h2>
            </div>
        </section>
    );
}
