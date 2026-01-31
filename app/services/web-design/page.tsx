import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Design",
  description:
    "Modern, conversion‑focused web design for startups and growing businesses.",
};

export default function WebDesignPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black px-4 md:px-[5vw] py-[12vh]">
      <h1 className="text-[12vw] md:text-[5vw] font-display font-semibold uppercase">
        Web Design
      </h1>
      <p className="mt-4 md:mt-6 text-base md:text-lg font-sans text-black/70 max-w-3xl">
        We craft clean, compelling interfaces that turn visitors into customers. Our design process balances strategy, clarity, and visual impact.
      </p>

      <ul className="mt-8 space-y-3 text-sm md:text-base font-sans text-black/80">
        <li>• UX research and user flows</li>
        <li>• UI design and design systems</li>
        <li>• Mobile‑first responsive layouts</li>
        <li>• Conversion‑focused structure</li>
      </ul>
    </main>
  );
}
