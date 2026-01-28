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

            <div className="h-fit pb-[10vh] relative overflow-clip w-full bg-lime-400 px-0 max-md:px-[6vw]">
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
                                    <div className="relative w-full h-full bg-black/10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 group-hover:from-black/70 group-hover:to-black/50 transition-all duration-500"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center p-8">
                                                <h3 className="text-white font-display font-bold text-[5vw] md:text-[2.5vw] mb-4 leading-tight">
                                                    {project.title}
                                                </h3>
                                                <p className="text-white/80 font-sans text-[3vw] md:text-[1.2vw] max-w-md mx-auto">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <div className="mt-4 px-2 w-full flex justify-between items-center text-black">
                                    <div className="fall-text">
                                        <h3 className="text-[2vw] max-md:text-[6vw] tracking-wide font-semibold font-display">
                                            {project.title}
                                        </h3>
                                    </div>
                                    <div className="reveal-text">
                                        <p className="text-[1.3vw] max-md:text-[4vw] font-sans font-medium mt-1">
                                            {project.category}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </AnimatedSection>
                </div>

                {/* CTA Section */}
                <div className="w-full mt-[10vw] px-[3vw] max-md:px-0">
                    <div className="fall-text">
                        <h2 className="text-[12vw] md:text-[8vw] w-full md:w-[50%] leading-none font-semibold font-display uppercase">
                            Every work you see here started with curiosity
                        </h2>
                    </div>
                    <div className="w-full md:w-[35%] ml-auto mt-[5vh] md:mt-0 text-black">
                        <div className="reveal-text">
                            <p className="text-[4vw] md:text-[1.3vw] font-sans max-md:leading-tight">
                                Have an idea, a challenge, or a direction you want to explore? You don't need all the answers yet. Reach out and let's see what we can build together.
                            </p>
                        </div>
                        <a href="/contact">
                            <button className="text-[4vw] rounded cursor-pointer md:text-[1.5vw] tracking-wide text-white font-semibold font-display uppercase px-3 py-1.5 md:px-4 md:py-2 relative mt-[3vh] bg-black group overflow-hidden">
                                <span className="relative overflow-clip inline-block" style={{ transformStyle: "preserve-3d", perspective: "1000px" }}>
                                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full" style={{ transformStyle: "preserve-3d" }}>Make It Real</span>
                                    <span className="inline-block absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0" style={{ transformStyle: "preserve-3d" }}>Make It Real</span>
                                </span>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
