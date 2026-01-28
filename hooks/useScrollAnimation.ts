import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldReduceMotion } from "@/utils/animations";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export type AnimationType = "fade" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "rotate";

interface UseScrollAnimationOptions {
    type?: AnimationType;
    duration?: number;
    delay?: number;
    start?: string;
    end?: string;
    scrub?: boolean;
    markers?: boolean;
    stagger?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || shouldReduceMotion()) return;

        const {
            type = "fade",
            duration = 1,
            delay = 0,
            start = "top 80%",
            end = "bottom 20%",
            scrub = false,
            markers = false,
            stagger = 0,
        } = options;

        const element = ref.current;

        // Define animation based on type
        const animations: Record<AnimationType, gsap.TweenVars> = {
            fade: {
                opacity: 0,
                y: 30,
            },
            slideUp: {
                opacity: 0,
                y: 60,
            },
            slideLeft: {
                opacity: 0,
                x: 60,
            },
            slideRight: {
                opacity: 0,
                x: -60,
            },
            scale: {
                opacity: 0,
                scale: 0.8,
            },
            rotate: {
                opacity: 0,
                rotation: 10,
            },
        };

        const from = animations[type];

        // Check if element has children for stagger
        const targets = stagger > 0 && element.children.length > 0
            ? Array.from(element.children)
            : element;

        gsap.fromTo(
            targets,
            from,
            {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                rotation: 0,
                duration,
                delay,
                stagger: stagger > 0 ? stagger : undefined,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start,
                    end,
                    scrub,
                    markers,
                    toggleActions: "play none none reverse",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.trigger === element) {
                    trigger.kill();
                }
            });
        };
    }, [options]);

    return ref;
};

// Hook for parallax scrolling
export const useParallax = (speed: number = 0.5) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || shouldReduceMotion()) return;

        const element = ref.current;

        gsap.to(element, {
            y: () => window.innerHeight * speed,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.trigger === element) {
                    trigger.kill();
                }
            });
        };
    }, [speed]);

    return ref;
};

// Hook for revealing elements on scroll
export const useRevealOnScroll = (threshold: number = 0.1) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || shouldReduceMotion()) return;

        const element = ref.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            element,
                            { opacity: 0, y: 50 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power3.out",
                            }
                        );
                        observer.unobserve(element);
                    }
                });
            },
            { threshold }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold]);

    return ref;
};
