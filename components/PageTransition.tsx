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

            // Strip hash and trailing slash for comparison
            const targetPath = href.split('#')[0].replace(/\/$/, "") || "/";
            const currentPath = pathname.replace(/\/$/, "") || "/";

            // If it's the current page (even with a hash), do nothing
            if (targetPath === currentPath) return;

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
        animateIn();
    }, [pathname]);

    // Safety fallback: if hash changes (same page nav), ensure we animate in
    useEffect(() => {
        const handleHashChange = () => {
            animateIn();
            setIsTransitioning(false);
        };
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

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
