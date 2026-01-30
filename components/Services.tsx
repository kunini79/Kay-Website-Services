"use client";

import AnimatedSection from "./AnimatedSection";

export default function Services() {
    return (
        <section className="overflow-y-clip relative w-full flex flex-col items-center justify-between">
            <div id="services" className="h-[20vh] md:h-[30vw] flex items-center justify-center w-full">
                <AnimatedSection animation="fade">
                    <div>
                        <h2 className="text-[16vw] relative z-10 md:text-[10vw] leading-none font-semibold font-display uppercase text-center">
                            We are <span className="text-lime-400">Good</span> at
                        </h2>
                    </div>
                </AnimatedSection>
            </div>

            <div className="max-md:h-[60vh] relative md:h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Background Hexagonal Decorations */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    {/* Top Left Hexagon */}
                    <div className="absolute top-[10%] left-[10%] w-32 h-32 rotate-45">
                        <div className="w-full h-full border-2 border-lime-400 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Top Right Hexagon */}
                    <div className="absolute top-[20%] right-[15%] w-24 h-24 rotate-12">
                        <div className="w-full h-full border-2 border-lime-400 rounded-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>

                    {/* Bottom Left Hexagon */}
                    <div className="absolute bottom-[15%] left-[20%] w-28 h-28 -rotate-12">
                        <div className="w-full h-full border-2 border-lime-400 rounded-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Bottom Right Hexagon */}
                    <div className="absolute bottom-[25%] right-[10%] w-20 h-20 rotate-45">
                        <div className="w-full h-full border-2 border-lime-400 rounded-lg animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    </div>

                    {/* Center Top Hexagon */}
                    <div className="absolute top-[5%] left-[45%] w-16 h-16 rotate-90">
                        <div className="w-full h-full border-2 border-lime-400 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                </div>

                {/* Grid Lines */}
                <div className="w-[150vw] h-px absolute top-1/2 -translate-y-1/2 left-[-10%] bg-zinc-500/30"></div>
                <div className="h-[300vh] w-px absolute top-[-70%] left-1/2 -translate-x-1/2 bg-zinc-500/30"></div>

                {/* Central Rotating Wheel Simulation */}
                <AnimatedSection animation="scale" className="relative max-md:size-[50vw] md:size-[35vw] mx-auto flex items-center justify-center animate-wheel-spin">
                    <div className="absolute inset-0 rounded-full border-2 border-lime-400 border-dashed flex items-center justify-center opacity-50"></div>

                    {/* Spikes */}
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="absolute" style={{ transform: `rotate(${i * 30}deg)`, width: '36vw', height: '2px', transformOrigin: 'center' }}>
                            <div className="absolute right-0 max-md:w-[2.5vw] md:w-[1.5vw] h-full bg-lime-400"></div>
                        </div>
                    ))}
                </AnimatedSection>

                {/* Floating Labels */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Design */}
                    <AnimatedSection
                        animation="slideLeft"
                        delay={0.2}
                        className="absolute top-1/2 left-[15%] -translate-y-1/2 max-md:text-[6vw] md:text-[2vw] font-display uppercase font-semibold whitespace-nowrap"
                    >
                        <div className="flex items-center">
                            <span className="relative inline-flex items-center justify-center mr-2">
                                <span className="absolute size-3 max-md:size-2 rounded-full bg-lime-400 animate-ping opacity-75"></span>
                                <span className="relative size-2 max-md:size-1.5 rounded-full bg-lime-400"></span>
                            </span>
                            <p>Design</p>
                        </div>
                    </AnimatedSection>

                    {/* Development */}
                    <AnimatedSection
                        animation="fade"
                        delay={0.3}
                        className="absolute top-[3%] left-1/2 -translate-x-1/2 max-md:text-[6vw] md:text-[2vw] font-display uppercase font-semibold whitespace-nowrap"
                    >
                        <div className="flex items-center">
                            <span className="relative inline-flex items-center justify-center mr-2">
                                <span className="absolute size-3 max-md:size-2 rounded-full bg-lime-400 animate-ping opacity-75"></span>
                                <span className="relative size-2 max-md:size-1.5 rounded-full bg-lime-400"></span>
                            </span>
                            <p>Development</p>
                        </div>
                    </AnimatedSection>

                    {/* SEO */}
                    <AnimatedSection
                        animation="slideRight"
                        delay={0.4}
                        className="absolute top-1/2 right-[15%] -translate-y-1/2 max-md:text-[6vw] md:text-[2vw] font-display uppercase font-semibold whitespace-nowrap"
                    >
                        <div className="flex items-center">
                            <span className="relative inline-flex items-center justify-center mr-2">
                                <span className="absolute size-3 max-md:size-2 rounded-full bg-lime-400 animate-ping opacity-75"></span>
                                <span className="relative size-2 max-md:size-1.5 rounded-full bg-lime-400"></span>
                            </span>
                            <p>SEO</p>
                        </div>
                    </AnimatedSection>

                    {/* E-commerce */}
                    <AnimatedSection
                        animation="fade"
                        delay={0.5}
                        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 max-md:text-[6vw] md:text-[2vw] font-display uppercase font-semibold whitespace-nowrap"
                    >
                        <div className="flex items-center">
                            <span className="relative inline-flex items-center justify-center mr-2">
                                <span className="absolute size-3 max-md:size-2 rounded-full bg-lime-400 animate-ping opacity-75"></span>
                                <span className="relative size-2 max-md:size-1.5 rounded-full bg-lime-400"></span>
                            </span>
                            <p>E-commerce</p>
                        </div>
                    </AnimatedSection>

                </div>
            </div>
        </section>
    );
}

