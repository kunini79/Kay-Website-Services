import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development",
  description:
    "High‑performance web development with modern stacks and SEO best practices.",
};

export default function WebDevelopmentPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black px-4 md:px-[5vw] py-[12vh]">
      <h1 className="text-[12vw] md:text-[5vw] font-display font-semibold uppercase">
        Web Development
      </h1>
      <p className="mt-4 md:mt-6 text-base md:text-lg font-sans text-black/70 max-w-3xl">
        We build fast, reliable, SEO‑ready websites using modern frameworks and best practices for performance, accessibility, and scalability.
      </p>

      <ul className="mt-8 space-y-3 text-sm md:text-base font-sans text-black/80">
        <li>• Next.js / React builds</li>
        <li>• Performance optimization</li>
        <li>• SEO‑ready architecture</li>
        <li>• Analytics + tracking setup</li>
      </ul>
    </main>
  );
}
