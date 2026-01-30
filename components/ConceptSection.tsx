"use client";

import { useRef } from "react";
import AnimatedSection from "./AnimatedSection";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const concepts = [
    {
        title: "Discovery",
        items: ["Creative Brief", "Brand Research", "Mood Boards"]
    },
    {
        title: "Concept",
        items: ["Visual Direction", "Art Direction", "Storyboarding"]
    },
    {
        title: "Develop",
        items: ["Creative Coding", "WebGL & 3D", "Animations"]
    },
    {
        title: "Design",
        items: ["UI/UX Craft", "Motion Design", "Interaction Design"]
    },
    {
        title: "Polish",
        items: ["Micro-interactions", "Performance", "Pixel Perfect"]
    },
    {
        title: "Launch",
        items: ["Go Live", "Case Study", "Awards Submit"]
    }
];

export default function ConceptSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const cards = sectionRef.current.querySelectorAll('.concept-card');

        gsap.fromTo(cards,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="w-full py-[15vh] px-[3vw] max-md:px-[6vw] bg-white">
            <AnimatedSection animation="fade">
                <h2 className="text-[12vw] md:text-[6vw] font-display font-semibold uppercase text-center mb-[10vh]">
                    Our <span className="text-lime-400">Process</span>
                </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {concepts.map((concept, index) => (
                    <div
                        key={index}
                        className="concept-card group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-lime-400 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <h3 className="text-[6vw] md:text-[2vw] font-display font-bold uppercase">
                                {concept.title}
                            </h3>
                            <div className="size-10 md:size-12 rounded-full bg-lime-400/20 flex items-center justify-center font-display font-bold text-lime-600 group-hover:bg-lime-400 group-hover:text-black transition-all">
                                0{index + 1}
                            </div>
                        </div>
                        <ul className="space-y-2">
                            {concept.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-600 font-sans text-sm md:text-base">
                                    <span className="size-1.5 rounded-full bg-lime-400 shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
