import { gsap } from "gsap";

// Respect user's motion preferences
export const shouldReduceMotion = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// GSAP Animation Presets
export const fadeIn = (element: HTMLElement, duration = 0.8) => {
    if (shouldReduceMotion()) return;

    return gsap.fromTo(
        element,
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration,
            ease: "power3.out",
        }
    );
};

export const slideInLeft = (element: HTMLElement, duration = 0.8) => {
    if (shouldReduceMotion()) return;

    return gsap.fromTo(
        element,
        { opacity: 0, x: -50 },
        {
            opacity: 1,
            x: 0,
            duration,
            ease: "power3.out",
        }
    );
};

export const slideInRight = (element: HTMLElement, duration = 0.8) => {
    if (shouldReduceMotion()) return;

    return gsap.fromTo(
        element,
        { opacity: 0, x: 50 },
        {
            opacity: 1,
            x: 0,
            duration,
            ease: "power3.out",
        }
    );
};

export const scaleIn = (element: HTMLElement, duration = 0.8) => {
    if (shouldReduceMotion()) return;

    return gsap.fromTo(
        element,
        { opacity: 0, scale: 0.8 },
        {
            opacity: 1,
            scale: 1,
            duration,
            ease: "back.out(1.4)",
        }
    );
};

export const staggerFadeIn = (elements: HTMLElement[], stagger = 0.1) => {
    if (shouldReduceMotion()) return;

    return gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger,
            ease: "power3.out",
        }
    );
};

// Parallax effect helper
export const parallax = (element: HTMLElement, speed = 0.5) => {
    if (shouldReduceMotion()) return;

    const handleScroll = () => {
        const scrolled = window.scrollY;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const offset = (scrolled - elementTop) * speed;

        gsap.to(element, {
            y: offset,
            duration: 0,
            ease: "none",
        });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
};

// Magnetic effect for buttons
export const magneticEffect = (
    element: HTMLElement,
    strength: number = 0.3
) => {
    if (shouldReduceMotion()) return;

    const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
            x: x * strength,
            y: y * strength,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
        });
    };

    element.addEventListener("mouseenter", () => {
        element.addEventListener("mousemove", handleMouseMove);
    });

    element.addEventListener("mouseleave", () => {
        element.removeEventListener("mousemove", handleMouseMove);
        handleMouseLeave();
    });
};

// Counter animation
export const animateCounter = (
    element: HTMLElement,
    target: number,
    duration = 2
) => {
    if (shouldReduceMotion()) {
        element.textContent = target.toString();
        return;
    }

    const obj = { value: 0 };

    return gsap.to(obj, {
        value: target,
        duration,
        ease: "power2.out",
        onUpdate: () => {
            element.textContent = Math.round(obj.value).toString();
        },
    });
};

// Ripple effect for clicks
export const createRipple = (event: React.MouseEvent<HTMLElement>, color = "rgba(255, 255, 255, 0.5)") => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.backgroundColor = color;
    ripple.style.pointerEvents = "none";
    ripple.style.transform = "scale(0)";

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    gsap.to(ripple, {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
    });
};
