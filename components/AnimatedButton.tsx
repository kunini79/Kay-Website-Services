"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { magneticEffect, createRipple } from "@/utils/animations";

interface AnimatedButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: "primary" | "secondary" | "outline";
    magnetic?: boolean;
    ripple?: boolean;
    className?: string;
}

export default function AnimatedButton({
    children,
    onClick,
    href,
    variant = "primary",
    magnetic = true,
    ripple = true,
    className = "",
}: AnimatedButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const element = buttonRef.current || linkRef.current;
        if (!element || !magnetic) return;

        magneticEffect(element as HTMLElement, 0.3);
    }, [magnetic]);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        if (ripple) {
            createRipple(e, variant === "primary" ? "rgba(163, 230, 53, 0.5)" : "rgba(255, 255, 255, 0.3)");
        }
        onClick?.();
    };

    const baseStyles = `
    relative overflow-hidden cursor-pointer group
    font-display uppercase font-semibold tracking-wide
    px-6 py-3 rounded-lg transition-all duration-300
    transform hover:scale-105 active:scale-95
    shadow-lg hover:shadow-xl
  `;

    const variants = {
        primary: "bg-lime-400 text-black hover:bg-lime-300 hover:shadow-lime-400/50",
        secondary: "bg-black text-white hover:bg-zinc-800",
        outline: "border-2 border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black",
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <Link
                ref={linkRef as any}
                href={href}
                className={combinedClassName}
                onClick={handleClick}
            >
                <span className="relative z-10">{children}</span>
            </Link>
        );
    }

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            className={combinedClassName}
        >
            <span className="relative z-10">{children}</span>
        </button>
    );
}
