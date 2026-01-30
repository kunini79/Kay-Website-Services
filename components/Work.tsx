"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AnimatedSection from "./AnimatedSection";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
    const stairsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!stairsRef.current) return;

        const bars = stairsRef.current.querySelectorAll('.stairs-bar');

        gsap.from(bars, {
            height: 0,
            duration: 0.8,
            stagger: {
                amount: 0.5,
                from: "center"
            },
            ease: "power2.out",
            scrollTrigger: {
                trigger: stairsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }, { scope: stairsRef });

    return (
        <section className="w-full" id="work">
            {/* Transition Box from Process to Work */}
            <div className="-mt-[20vh] pointer-events-none relative z-[100]" ref={stairsRef}>
                <div className="h-[20vh] w-full flex items-end pointer-events-none">
                    {[20, 40, 60, 80, 100, 80, 60, 40, 20].map((height, i) => (
                        <div
                            key={i}
                            className="stairs-bar flex-1 bg-lime-400 origin-bottom"
                            style={{ height: `${height}%` }}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="h-fit pb-[75vh] relative overflow-clip w-full bg-lime-400 px-0 max-md:px-[6vw]">
                <AnimatedSection animation="fade">
                    <h2 className="text-[16vw] text-center md:text-[8vw] leading-none font-semibold font-display uppercase">
                        FEATURED WORK
                    </h2>
                </AnimatedSection>

                {/* Background decorative lines */}
                <div className="w-full relative mt-[10vw] px-[10vw] max-md:px-0">
                    <div className="w-full h-full absolute top-0 left-0 pointer-events-none mix-blend-overlay opacity-30">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] border rounded-full"></div>
                    </div>

                    {/* Work Items Grid */}
                    <AnimatedSection animation="fade" stagger={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-y-[10vh] gap-x-[5vw] relative z-10">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className={`w-full ${index === 0 ? 'mt-[5vh] md:mt-[10vh]' : index === 1 ? 'md:mt-0' : ''}`}
                            >
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block rounded-[2vw] md:rounded-[1vw] overflow-hidden relative aspect-[4/3] group"
                                >
                                    <div className="relative w-full h-full bg-black/5 overflow-hidden">
                                        {/* Image placeholder with gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 via-lime-400/10 to-transparent"></div>
                                        
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <div className="text-center p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <h3 className="text-white font-display font-bold text-[5vw] md:text-[2.5vw] mb-4 leading-tight">
                                                    {project.title}
                                                </h3>
                                                <p className="text-white/90 font-sans text-[3vw] md:text-[1.2vw] max-w-md mx-auto leading-relaxed">
                                                    {project.description}
                                                </p>
                                                <div className="mt-6 inline-flex items-center gap-2 text-lime-400 font-display uppercase text-sm font-bold">
                                                    <span>View Project</span>
                                                    <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Project number badge */}
                                        <div className="absolute top-4 right-4 size-12 md:size-16 rounded-full bg-lime-400 flex items-center justify-center font-display font-bold text-black text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300">
                                            0{project.id}
                                        </div>
                                    </div>
                                </a>
                                <div className="mt-4 px-2 w-full flex justify-between items-center text-black">
                                    <div className="fall-text">
                                        <h3 className="text-[4vw] max-md:text-[6vw] md:text-[2vw] tracking-wide font-semibold font-display">
                                            {project.title}
                                        </h3>
                                    </div>
                                    <div className="reveal-text">
                                        <p className="text-[2.5vw] max-md:text-[4vw] md:text-[1.3vw] font-sans font-medium mt-1">
                                            {project.category}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </AnimatedSection>
                </div>

                {/* CTA Section */}
                <AnimatedSection animation="fade" className="w-full mt-[12vw] px-[3vw] max-md:px-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-[5vh] md:gap-[5vw] relative z-10">
                    <h2 className="text-[12vw] md:text-[7vw] w-full md:w-[60%] leading-[0.9] font-semibold font-display uppercase text-black">
                        Every work you see here started with a <span className="text-black/50">conversation</span>
                    </h2>
                    <div className="w-full md:w-[40%] text-black flex flex-col items-start text-left md:translate-y-[25vh]">
                        <p className="text-[4.5vw] md:text-[1.3vw] font-sans max-md:leading-snug leading-relaxed mb-[4vh] max-w-lg">
                            Have an idea, a challenge, or a direction you want to explore? You don't need all the answers yet. A focused conversation is often enough to uncover the right path.
                        </p>
                        <a href="/contact" className="inline-block">
                            <button className="text-[4vw] rounded-lg cursor-pointer md:text-[1.5vw] tracking-wide text-white font-semibold font-display uppercase px-8 py-4 md:px-8 md:py-4 bg-black group overflow-hidden relative transition-all hover:bg-black/90 hover:shadow-xl">
                                <span className="relative overflow-clip inline-block" style={{ transformStyle: "preserve-3d", perspective: "1000px" }}>
                                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full" style={{ transformStyle: "preserve-3d" }}>
                                        Schedule Call
                                    </span>
                                    <span className="inline-block absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0" style={{ transformStyle: "preserve-3d" }}>
                                        Schedule Call
                                    </span>
                                </span>
                            </button>
                        </a>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
