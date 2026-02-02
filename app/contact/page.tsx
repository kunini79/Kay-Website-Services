"use client";

import Navigation from "@/components/Navigation";
import Link from "next/link";
import { useState, FormEvent, useRef, useEffect } from "react";

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (submitStatus !== 'idle' && statusRef.current) {
            statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [submitStatus]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('Full_Name') as string,
            email: formData.get('Email') as string,
            phone: formData.get('Phone_Number') as string,
            message: formData.get('Message') as string,
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmitStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                const result = await response.json().catch(() => null);
                setErrorMessage(result?.error || 'Something went wrong. Please try again.');
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('Network error. Please try again.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="w-full min-h-screen bg-[#f5f5f5] text-black overflow-hidden relative z-10">
                <div className="w-full pt-[15vh] md:pt-[20vh] pb-[5vh] px-4 md:px-[5vw]">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-0">
                        <div>
                            <h1 className="text-[16vw] md:text-[8vw] leading-[0.85] font-display font-semibold uppercase">
                                Ready to start<br />
                                <span className="text-lime-400">something great?</span>
                            </h1>
                        </div>

                        <div className="w-fit md:hidden block">
                            <div className="reveal-text">
                                <div>
                                    <p className="text-base font-sans text-black/70 max-w-[300px]">
                                        We'd love to hear about your project and see how we can help bring it to life. Let's create something amazing together.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-fit hidden md:block">
                            <div className="reveal-text">
                                <div>
                                    <p className="text-[3vw] md:text-[1.2vw] font-sans text-black/70 max-w-[300px]">
                                        We'd love to hear about your project and see how we can help bring it to life. Let's create something amazing together.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Marquee Section */}
                <div className="w-full border-y border-black/10 py-4 md:py-6 overflow-hidden"
                    style={{
                        maskImage: "linear-gradient(to right, transparent 0px, black 4vw, black calc(100% - 4vw), transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to right, transparent 0px, black 4vw, black calc(100% - 4vw), transparent 100%)"
                    }}>
                    <div className="flex whitespace-nowrap animate-scrolling-text" style={{ width: "max-content", display: "flex" }}>
                        {[...Array(20)].map((_, i) => (
                            <span key={i} className="text-xs md:text-[1vw] font-sans text-black/30 mx-4 md:mx-8 shrink-0">
                                AVAILABLE FOR PROJECTS • OPEN TO COLLABORATE • LET'S CREATE TOGETHER
                            </span>
                        ))}
                    </div>
                </div>

                <div className="w-full px-4 md:px-[5vw] py-[10vh] md:py-[15vh]">
                    <div className="flex flex-col lg:flex-row gap-12 md:gap-[10vw]">
                        <div className="md:w-1/2">
                            <div className="w-fit">
                                <div>
                                    <p className="text-xs md:text-[1vw] font-sans text-black/40 uppercase tracking-widest mb-4 md:mb-8">
                                        Get in touch
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-[10vw] md:text-[4vw] font-display font-semibold leading-[1.1] uppercase mb-8 md:mb-12">
                                    Have a project in mind? We're here to make it happen.
                                </h2>
                            </div>

                            <div className="space-y-6 md:space-y-8 mt-8 md:mt-16">
                                <div>
                                    <div className="w-fit">
                                        <div>
                                            <p className="text-black/40 text-xs md:text-sm font-sans uppercase tracking-wider mb-1 md:mb-2">
                                                Email
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-fit">
                                        <div>
                                            <a href="mailto:agency@kaycorp.tech" className="text-[5vw] md:text-[2vw] font-display hover:text-lime-600 transition-colors">
                                                agency@kaycorp.tech
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="w-fit">
                                        <div>
                                            <p className="text-black/40 text-xs md:text-sm font-sans uppercase tracking-wider mb-1 md:mb-2">
                                                Phone
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-fit">
                                        <div>
                                            <a href="tel:+2347011350459" className="text-[5vw] md:text-[2vw] font-display hover:text-lime-600 transition-colors">
                                                +234 701 135 0459
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="w-fit">
                                        <div>
                                            <p className="text-black/40 text-xs md:text-sm font-sans uppercase tracking-wider mb-1 md:mb-2">
                                                Location
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-fit">
                                        <div>
                                            <p className="text-[5vw] md:text-[2vw] font-display">
                                                Yola, Nigeria
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 md:gap-6 mt-10 md:mt-16">
                                <div className="w-fit">
                                    <div className="reveal-text">
                                        <div>
                                            <a target="_blank" rel="noopener noreferrer" href="https://instagram.com/kaycorp" className="text-xs md:text-sm font-sans text-black/50 hover:text-lime-600 transition-colors uppercase tracking-wider">
                                                Instagram
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-fit">
                                    <div className="reveal-text">
                                        <div>
                                            <a target="_blank" rel="noopener noreferrer" href="https://w" className="text-xs md:text-sm font-sans text-black/50 hover:text-lime-600 transition-colors uppercase tracking-wider">
                                                LinkedIn
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 mt-8 lg:mt-0">
                            <form onSubmit={handleSubmit} action="#" className="space-y-8 md:space-y-12">
                                
                                <div>
                                    <div className="w-fit">
                                        <div className="reveal-text">
                                            <div>
                                                <label 
                                                    htmlFor="fullName"
                                                    className="text-black/40 text-xs md:text-sm font-sans uppercase tracking-wider block mb-3 md:mb-4"
                                                >
                                                    01 — Your Name
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        id="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        aria-required="true"
                                        className="w-full bg-transparent border-b border-black/20 pb-3 md:pb-4 text-base md:text-[2vw] font-display focus:outline-none focus:border-lime-600 transition-colors placeholder:text-black/20"
                                        name="Full_Name"
                                    />
                                </div>
                                <div>
                                    <div className="w-fit">
                                        <div className="reveal-text">
                                            <div>
                                                <label 
                                                    htmlFor="email"
                                                    className="text-black/40 text-xs md:text-sm font-sans uppercase tracking-wider block mb-3 md:mb-4"
                                                >
                                                    02 — Your Email
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        aria-required="true"
                                        className="w-full bg-transparent border-b border-black/20 pb-3 md:pb-4 text-base md:text-[2vw] font-display focus:outline-none focus:border-lime-600 transition-colors placeholder:text-black/20"
                                        name="Email"
                                    />
                                </div>
                                <div>
                                    <div className="w-fit">
                                        <div className="reveal-text">
                                            <div>
                                                <label 
                                                    htmlFor="phone"
                                                    className="text-black/40 text-xs md:text-sm font-sans uppercase tracking-wider block mb-3 md:mb-4"
                                                >
                                                    03 — Your Phone Number
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="+91 1234567890"
                                        className="w-full bg-transparent border-b border-black/20 pb-3 md:pb-4 text-base md:text-[2vw] font-display focus:outline-none focus:border-lime-600 transition-colors placeholder:text-black/20"
                                        name="Phone_Number"
                                    />
                                </div>
                                <div>
                                    <div className="w-fit">
                                        <div className="reveal-text">
                                            <div>
                                                <label 
                                                    htmlFor="message"
                                                    className="text-black/40 text-xs md:text-sm font-sans uppercase tracking-wider block mb-3 md:mb-4"
                                                >
                                                    04 — Tell us about your project
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <textarea
                                        id="message"
                                        name="Message"
                                        placeholder="I need help with..."
                                        rows={4}
                                        required
                                        aria-required="true"
                                        className="w-full bg-transparent border-b border-black/20 pb-3 md:pb-4 text-base md:text-[2vw] font-display focus:outline-none focus:border-lime-600 transition-colors placeholder:text-black/20 resize-none"
                                    ></textarea>
                                </div>
                                <div ref={statusRef} aria-live="polite" role="status">
                                    {submitStatus === 'success' && (
                                        <div className="bg-lime-400/20 border border-lime-600 text-lime-900 px-4 py-3 rounded">
                                            <p className="font-sans text-sm">✓ Thank you! Your message has been sent successfully.</p>
                                        </div>
                                    )}
                                    {submitStatus === 'error' && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                            <p className="font-sans text-sm">✗ {errorMessage || 'Something went wrong. Please try again.'}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="w-fit">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="text-[5vw] md:text-[2vw] tracking-wide text-black font-semibold font-display uppercase px-4 py-2 md:px-6 md:py-3 relative bg-lime-400 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4 md:mt-8 group" 
                                        style={{ overflow: "visible" }}
                                    >
                                        <span className="relative overflow-clip inline-block" style={{ transformStyle: "preserve-3d", perspective: "1000px" }}>
                                            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full" style={{ transformStyle: "preserve-3d" }}>
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                            </span>
                                            <span className="inline-block absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0" style={{ transformStyle: "preserve-3d" }}>
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Navigation />
        </>
    );
}
