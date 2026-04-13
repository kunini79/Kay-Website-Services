"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "success" | "error";

export default function BlogNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitState("idle");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "blog",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Could not subscribe right now.");
      }

      setSubmitState("success");
      setMessage(data?.message || "Thanks for subscribing.");
      setEmail("");
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not subscribe right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 rounded-[2rem] border border-black/10 bg-black px-6 py-8 text-white dark:border-white/10 md:px-10 md:py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-[#BBFD6A] md:text-sm">
            Newsletter
          </p>
          <h2 className="mt-4 text-[11vw] leading-[0.92] font-display font-semibold uppercase md:text-[4.2vw]">
            Get practical tech guidance in your inbox.
          </h2>
          <p className="mt-4 text-sm font-sans leading-7 text-white/72 md:text-base">
            Thoughtful updates from KayCorp on technology, digital habits, and the latest science shaping how families and modern life interact with screens.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xl">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              id="newsletter-email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              aria-required="true"
              className="min-h-[56px] flex-1 rounded-full border border-white/15 bg-white/8 px-5 text-base font-sans text-white placeholder:text-white/45 focus:border-[#BBFD6A] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[56px] rounded-full bg-[#BBFD6A] px-6 text-sm font-sans font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#a9e65e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Joining..." : "Subscribe"}
            </button>
          </div>

          <p className="mt-4 text-xs font-sans uppercase tracking-[0.16em] text-white/45">
            No spam. Just useful tips, grounded research, and timely updates.
          </p>

          {submitState !== "idle" && (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-sans ${
                submitState === "success"
                  ? "border-[#BBFD6A]/40 bg-[#BBFD6A]/10 text-[#E8FFD0]"
                  : "border-red-400/40 bg-red-500/10 text-red-200"
              }`}
              aria-live="polite"
              role="status"
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
