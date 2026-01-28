'use client';

import { useRef, useEffect, useState, RefObject } from 'react';
import { motion, useMotionValue, MotionValue } from 'framer-motion';

/* =====================
   Layout Presets
===================== */

const desktopLayout = (w: number, h: number) => {
    const top = h * 0.25;
    const mid = h * 0.5;
    const bottom = h * 0.65;

    return {
        discovery: { x: w * 0.12, y: mid },
        design: { x: w * 0.32, y: top },
        develop: { x: w * 0.32, y: bottom },
        polish: { x: w * 0.55, y: mid },
        launch: { x: w * 0.75, y: mid },
    };
};

const mobileLayout = (w: number, h: number) => {
    const center = w / 2;
    const step = h * 0.16;

    return {
        discovery: { x: center, y: step * 1 },
        design: { x: center, y: step * 2 },
        develop: { x: center, y: step * 3 },
        polish: { x: center, y: step * 4 },
        launch: { x: center, y: step * 5 },
    };
};

/* =====================
   Main Component
===================== */

export default function Process() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    const discoveryX = useMotionValue(0);
    const discoveryY = useMotionValue(0);
    const designX = useMotionValue(0);
    const designY = useMotionValue(0);
    const developX = useMotionValue(0);
    const developY = useMotionValue(0);
    const polishX = useMotionValue(0);
    const polishY = useMotionValue(0);
    const launchX = useMotionValue(0);
    const launchY = useMotionValue(0);

    const applyLayout = () => {
        if (!containerRef.current) return;

        const { width, height } = containerRef.current.getBoundingClientRect();
        const isMobile = width < 768;
        const pos = isMobile ? mobileLayout(width, height) : desktopLayout(width, height);

        discoveryX.set(pos.discovery.x);
        discoveryY.set(pos.discovery.y);
        designX.set(pos.design.x);
        designY.set(pos.design.y);
        developX.set(pos.develop.x);
        developY.set(pos.develop.y);
        polishX.set(pos.polish.x);
        polishY.set(pos.polish.y);
        launchX.set(pos.launch.x);
        launchY.set(pos.launch.y);
    };

    useEffect(() => {
        applyLayout();
        window.addEventListener('resize', applyLayout);
        return () => window.removeEventListener('resize', applyLayout);
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => setVisible(e.isIntersecting),
            { threshold: 0.2 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section id="process" className="w-full">
            <div ref={sectionRef} className="py-[18vh] max-md:py-[10vh] px-[4vw]">
                <div
                    ref={containerRef}
                    className="relative w-full h-[65vh] max-md:h-[80vh]
                    border border-zinc-200 rounded-3xl bg-[#fafafa]
                    px-[6vw] py-[8vh]"
                >
                    {/* CONNECTIONS */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <Bezier aX={discoveryX} aY={discoveryY} bX={designX} bY={designY} />
                        <Bezier aX={designX} aY={designY} bX={developX} bY={developY} />
                        <Bezier aX={developX} aY={developY} bX={polishX} bY={polishY} />
                        <Bezier aX={polishX} aY={polishY} bX={launchX} bY={launchY} />
                    </svg>

                    <Node title="DISCOVERY" x={discoveryX} y={discoveryY}>
                        <li>Creative Brief</li>
                        <li>Brand Research</li>
                        <li>Mood Boards</li>
                    </Node>

                    <Node title="DESIGN" x={designX} y={designY} dark>
                        <li>Visual Direction</li>
                        <li>Art Direction</li>
                        <li>Storyboarding</li>
                    </Node>

                    <Node title="DEVELOP" x={developX} y={developY} dark>
                        <li>Creative Coding</li>
                        <li>WebGL & 3D</li>
                        <li>Animations</li>
                    </Node>

                    <Node title="POLISH" x={polishX} y={polishY}>
                        <li>Micro-interactions</li>
                        <li>Performance</li>
                        <li>Pixel Perfect</li>
                    </Node>

                    <Node title="LAUNCH" x={launchX} y={launchY} dark>
                        <li>Go Live</li>
                        <li>Case Study</li>
                        <li>Awards Submit</li>
                    </Node>

                    {visible && (
                        <motion.button
                            onClick={applyLayout}
                            className="absolute bottom-8 right-8 bg-lime-400 text-black font-display font-bold uppercase px-6 py-3 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            RESET
                        </motion.button>
                    )}
                </div>
            </div>
        </section>
    );
}

/* =====================
   Bezier Curve
===================== */

function Bezier({
    aX,
    aY,
    bX,
    bY,
}: {
    aX: MotionValue<number>;
    aY: MotionValue<number>;
    bX: MotionValue<number>;
    bY: MotionValue<number>;
}) {
    const d = `
        M ${aX.get()} ${aY.get()}
        C ${(aX.get() + bX.get()) / 2} ${aY.get()},
          ${(aX.get() + bX.get()) / 2} ${bY.get()},
          ${bX.get()} ${bY.get()}
    `;

    return <motion.path d={d} stroke="#d4d4d8" strokeWidth="2" fill="none" />;
}

/* =====================
   Node Component
===================== */

function Node({
    x,
    y,
    title,
    dark,
    children,
}: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    title: string;
    dark?: boolean;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            drag
            style={{ x, y, position: 'absolute', top: 0, left: 0 }}
            className="-translate-x-1/2 -translate-y-1/2 z-10"
            whileHover={{ scale: 1.04 }}
        >
            <div className="text-center mb-2 font-display font-bold uppercase">
                {title}
            </div>
            <div
                className={`rounded-xl p-6 w-[220px] shadow-lg text-sm
                ${dark ? 'bg-black text-lime-400' : 'bg-lime-400 text-black'}`}
            >
                <ul className="space-y-2 font-sans font-medium">
                    {children}
                </ul>
            </div>
        </motion.div>
    );
}
