"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const barsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Transition Out (Enter new page)
    const animateIn = () => {
        if (!containerRef.current) return;

        // Set origin to top so they shrink upwards
        barsRef.current.forEach((bar) => {
            if (bar) bar.style.transformOrigin = "top";
        });

        gsap.to(barsRef.current, {
            scaleY: 0,
            duration: 0.8,
            ease: "power2.inOut",
            stagger: {
                from: "edges",
                amount: 0.1,
            },
            onComplete: () => {
                if (containerRef.current) containerRef.current.style.pointerEvents = "none";
            },
        });
    };

    // Transition In (Leave current page)
    const animateOut = (href: string) => {
        if (!containerRef.current) return;

        // Enable pointer events to block interaction
        containerRef.current.style.pointerEvents = "auto";

        // Set origin to bottom so they grow upwards
        barsRef.current.forEach((bar) => {
            if (bar) bar.style.transformOrigin = "bottom";
        });

        gsap.fromTo(
            barsRef.current,
            { scaleY: 0 },
            {
                scaleY: 1,
                duration: 0.8,
                ease: "power2.inOut",
                stagger: {
                    from: "center",
                    amount: 0.1,
                },
                onComplete: () => {
                    setIsTransitioning(false);
                    router.push(href);
                },
            }
        );
    };

    // Initial load animation
    useEffect(() => {
        // Reset bars
        gsap.set(barsRef.current, { scaleY: 1 });
        // Animate in
        setTimeout(() => {
            animateIn();
        }, 100);
    }, []); // Run once on mount

    // Intercept Utility
    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");
            if (!link) return;

            const href = link.getAttribute("href");
            if (!href || !href.startsWith("/") || href.startsWith("#")) return;

            // If it's the current page, do nothing
            if (href === pathname || href === window.location.pathname) return;

            e.preventDefault();
            if (isTransitioning) return;

            setIsTransitioning(true);
            animateOut(href);
        };

        // Attach to document to catch all links
        document.addEventListener("click", handleLinkClick);

        return () => {
            document.removeEventListener("click", handleLinkClick);
        };
    }, [pathname, isTransitioning, router]);

    // When pathname changes (after navigation), animate in
    useEffect(() => {
        // If we just navigated, we should animate in
        // But animateIn is also called on initial mount.
        // We can rely on router event flow:
        // 1. Link click -> animateOut -> router.push
        // 2. Pathname changes -> Component re-renders (or not if layout persists) -> useEffect triggered

        // Wait, if this component is in Layout, it doesn't unmount.
        // So on pathname change, we should animateIn?
        // animateOut ends with router.push.
        // Then pathname updates.
        // Then we should animateIn.

        // However, we need to ensure the bars are ALREADY there (scaleY: 1) effectively.
        // If animateOut finished, scaleY is 1.
        // So we just need to animateIn.

        animateIn();

    }, [pathname]);

    return (
        <>
            <div
                ref={containerRef}
                className="fixed top-0 left-0 w-full h-screen flex pointer-events-auto z-[9999]"
            >
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => { if (el) barsRef.current[i] = el; }}
                        className="flex-1 bg-lime-400"
                        style={{ transform: "scaleY(1)", transformOrigin: "bottom" }} // Start visible (blocking) until JS loads/mounts to reveal
                    ></div>
                ))}
            </div>
            {children}
        </>
    );
}
