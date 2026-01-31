import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Kay Website Services: web design, web development, and branding for modern businesses.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black px-4 md:px-[5vw] py-[12vh]">
      <h1 className="text-[12vw] md:text-[5vw] font-display font-semibold uppercase">
        Services
      </h1>
      <p className="mt-4 md:mt-6 text-base md:text-lg font-sans text-black/70 max-w-2xl">
        We design and build high‑converting websites with clear strategy, modern UI, and reliable performance.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/services/web-design" className="bg-white border border-black/10 rounded-2xl p-6 hover:border-black/30 transition-colors">
          <h2 className="text-[6vw] md:text-[2vw] font-display font-semibold">Web Design</h2>
          <p className="mt-3 text-sm md:text-base font-sans text-black/70">
            UX, UI, and visual systems that make brands feel premium and clear.
          </p>
        </Link>
        <Link href="/services/web-development" className="bg-white border border-black/10 rounded-2xl p-6 hover:border-black/30 transition-colors">
          <h2 className="text-[6vw] md:text-[2vw] font-display font-semibold">Web Development</h2>
          <p className="mt-3 text-sm md:text-base font-sans text-black/70">
            Fast, accessible, SEO‑ready builds using modern stacks like Next.js.
          </p>
        </Link>
        <Link href="/services/branding-ui-ux" className="bg-white border border-black/10 rounded-2xl p-6 hover:border-black/30 transition-colors">
          <h2 className="text-[6vw] md:text-[2vw] font-display font-semibold">Branding & UI/UX</h2>
          <p className="mt-3 text-sm md:text-base font-sans text-black/70">
            Messaging, identity, and design systems that scale with your business.
          </p>
        </Link>
      </div>
    </main>
  );
}
