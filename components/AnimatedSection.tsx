"use client";

import { useScrollAnimation, AnimationType } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
    children: React.ReactNode;
    animation?: AnimationType;
    className?: string;
    stagger?: number;
    delay?: number;
}

export default function AnimatedSection({
    children,
    animation = "fade",
    className = "",
    stagger = 0,
    delay = 0,
}: AnimatedSectionProps) {
    const ref = useScrollAnimation({
        type: animation,
        stagger,
        delay,
    });

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
